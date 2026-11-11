package backend;

import backend.Model.UserModel;
import backend.Model.VideoModel;
import backend.Repository.UserRepository;
import backend.Repository.VideoRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "app.upload.dir=${java.io.tmpdir}/peerlink-video-upload-tests")
class VideoUploadIntegrationTests {
    @Autowired
    private WebApplicationContext applicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Value("${app.upload.dir}")
    private String uploadDirectory;

    private MockMvc mockMvc;
    private MockHttpSession session;
    private UserModel testUser;

    @BeforeEach
    void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(applicationContext).build();

        testUser = new UserModel();
        testUser.setFirstName("Video");
        testUser.setLastName("Upload Test");
        testUser.setEmail("video-upload-" + UUID.randomUUID() + "@example.test");
        testUser.setPassword("test-password");
        testUser.setRole("USER");
        testUser = userRepository.save(testUser);

        MvcResult loginResult = mockMvc.perform(post("/api/login")
                        .contentType("application/json")
                        .content("{\"email\":\"" + testUser.getEmail()
                                + "\",\"password\":\"test-password\"}"))
                .andExpect(status().isOk())
                .andReturn();
        session = (MockHttpSession) loginResult.getRequest().getSession(false);
        assertNotNull(session);
    }

    @AfterEach
    void cleanUp() throws Exception {
        if (testUser == null || testUser.getId() == null) {
            return;
        }

        for (VideoModel video : videoRepository.findAll()) {
            if (video.getUploadedBy().getId().equals(testUser.getId())) {
                if (video.getStoredFileName() != null) {
                    Files.deleteIfExists(Path.of(uploadDirectory).resolve(video.getStoredFileName()));
                }
                videoRepository.delete(video);
            }
        }
        userRepository.delete(testUser);
    }

    @Test
    void authenticatedUserCanUploadVideoAndSaveMetadata() throws Exception {
        MockMultipartFile videoFile = new MockMultipartFile(
                "video",
                "lecture.mp4",
                "video/mp4",
                new byte[]{0, 0, 0, 24, 102, 116, 121, 112}
        );

        MvcResult result = mockMvc.perform(multipart("/api/videos")
                        .file(videoFile)
                        .param("subject", "Computer Science")
                        .param("description", "Introduction to algorithms")
                        .param("source", "file")
                        .session(session))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.source").value("file"))
                .andExpect(jsonPath("$.subject").value("Computer Science"))
                .andReturn();

        VideoModel savedVideo = videoRepository.findAll().stream()
                .filter(video -> video.getUploadedBy().getId().equals(testUser.getId()))
                .findFirst()
                .orElseThrow();

        assertEquals("Introduction to algorithms", savedVideo.getDescription());
        assertEquals("lecture.mp4", savedVideo.getOriginalFileName());
        assertTrue(Files.exists(Path.of(uploadDirectory).resolve(savedVideo.getStoredFileName())));
        assertTrue(result.getResponse().getContentAsString().contains("\"id\""));

        String catalog = mockMvc.perform(get("/api/videos").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertTrue(catalog.contains("Introduction to algorithms"));

        String myLessons = mockMvc.perform(get("/api/videos/mine").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        assertTrue(myLessons.contains("Introduction to algorithms"));

        mockMvc.perform(get("/api/videos/{id}/file", savedVideo.getId()).session(session))
                .andExpect(status().isOk())
                .andExpect(content().bytes(videoFile.getBytes()));
    }

    @Test
    void authenticatedUserCanSaveVideoLink() throws Exception {
        mockMvc.perform(multipart("/api/videos")
                        .param("subject", "Software Engineering")
                        .param("description", "Architecture lecture")
                        .param("source", "link")
                        .param("videoLink", "https://example.com/lecture")
                        .session(session))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.source").value("link"))
                .andExpect(jsonPath("$.videoLink").value("https://example.com/lecture"));
    }

    @Test
    void uploadRequiresLoginSession() throws Exception {
        mockMvc.perform(multipart("/api/videos")
                        .param("subject", "Computer Science")
                        .param("description", "Unauthenticated upload")
                        .param("source", "link")
                        .param("videoLink", "https://example.com/lecture"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void uploadRejectsSubjectsOutsideTheDropdown() throws Exception {
        mockMvc.perform(multipart("/api/videos")
                        .param("subject", "Unlisted subject")
                        .param("description", "Invalid subject test")
                        .param("source", "link")
                        .param("videoLink", "https://example.com/lecture")
                        .session(session))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Select a subject from the list."));
    }

    @Test
    void uploadRejectsNonVideoFiles() throws Exception {
        MockMultipartFile textFile = new MockMultipartFile(
                "video",
                "notes.txt",
                "text/plain",
                "not a video".getBytes()
        );

        mockMvc.perform(multipart("/api/videos")
                        .file(textFile)
                        .param("subject", "Computer Science")
                        .param("description", "Invalid file type test")
                        .param("source", "file")
                        .session(session))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("The selected file must be a video."));
    }

    @Test
    void ownerCanDeleteUploadedFileAndMetadata() throws Exception {
        MockMultipartFile videoFile = new MockMultipartFile(
                "video",
                "delete-me.mp4",
                "video/mp4",
                new byte[]{0, 0, 0, 24, 102, 116, 121, 112}
        );
        mockMvc.perform(multipart("/api/videos")
                        .file(videoFile)
                        .param("subject", "Computer Science")
                        .param("description", "Delete test video")
                        .param("source", "file")
                        .session(session))
                .andExpect(status().isCreated());

        VideoModel uploadedVideo = videoRepository.findAll().stream()
                .filter(video -> video.getUploadedBy().getId().equals(testUser.getId()))
                .findFirst()
                .orElseThrow();
        Path storedFile = Path.of(uploadDirectory).resolve(uploadedVideo.getStoredFileName());
        assertTrue(Files.exists(storedFile));

        mockMvc.perform(delete("/api/videos/{id}", uploadedVideo.getId()).session(session))
                .andExpect(status().isNoContent());

        assertFalse(videoRepository.existsById(uploadedVideo.getId()));
        assertFalse(Files.exists(storedFile));
    }

    @Test
    void anotherUserCannotDeleteSomeoneElsesLesson() throws Exception {
        mockMvc.perform(multipart("/api/videos")
                        .param("subject", "Computer Science")
                        .param("description", "Owned link test")
                        .param("source", "link")
                        .param("videoLink", "https://example.com/owned-lesson")
                        .session(session))
                .andExpect(status().isCreated());

        VideoModel uploadedVideo = videoRepository.findAll().stream()
                .filter(video -> video.getUploadedBy().getId().equals(testUser.getId()))
                .findFirst()
                .orElseThrow();

        UserModel otherUser = new UserModel();
        otherUser.setFirstName("Other");
        otherUser.setLastName("Test");
        otherUser.setEmail("video-delete-" + UUID.randomUUID() + "@example.test");
        otherUser.setPassword("test-password");
        otherUser.setRole("USER");
        otherUser = userRepository.save(otherUser);

        try {
            MvcResult loginResult = mockMvc.perform(post("/api/login")
                            .contentType("application/json")
                            .content("{\"email\":\"" + otherUser.getEmail()
                                    + "\",\"password\":\"test-password\"}"))
                    .andExpect(status().isOk())
                    .andReturn();
            MockHttpSession otherSession = (MockHttpSession) loginResult.getRequest().getSession(false);
            assertNotNull(otherSession);

            mockMvc.perform(delete("/api/videos/{id}", uploadedVideo.getId()).session(otherSession))
                    .andExpect(status().isNotFound());
            assertTrue(videoRepository.existsById(uploadedVideo.getId()));
        } finally {
            userRepository.delete(otherUser);
        }
    }
}
