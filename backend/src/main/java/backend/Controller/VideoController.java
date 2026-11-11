package backend.Controller;

import backend.Model.VideoModel;
import backend.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping
    public ResponseEntity<?> getAllVideos(HttpServletRequest servletRequest) {
        if (!hasAuthenticatedUser(servletRequest)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Log in to view the course catalog."));
        }
        List<VideoResponse> videos = videoService.findAll().stream()
                .map(VideoResponse::from)
                .toList();
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<?> getVideoFile(
            @PathVariable Long id,
            HttpServletRequest servletRequest
    ) {
        if (!hasAuthenticatedUser(servletRequest)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Log in to view this video."));
        }

        VideoModel video = videoService.findById(id);
        Path videoPath = videoService.getStoredVideoPath(video);
        Resource resource = new FileSystemResource(videoPath);
        ContentDisposition disposition = ContentDisposition.inline()
                .filename(video.getOriginalFileName(), StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(video.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(resource);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadVideo(
            @RequestParam String subject,
            @RequestParam String description,
            @RequestParam String source,
            @RequestParam(required = false) MultipartFile video,
            @RequestParam(required = false) String videoLink,
            HttpServletRequest servletRequest
    ) {
        Long authenticatedUserId = getAuthenticatedUserId(servletRequest);
        if (authenticatedUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Log in before submitting a video."));
        }

        VideoModel savedVideo = videoService.upload(
                authenticatedUserId,
                subject,
                description,
                source,
                video,
                videoLink
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(VideoResponse.from(savedVideo));
    }

    private boolean hasAuthenticatedUser(HttpServletRequest request) {
        return getAuthenticatedUserId(request) != null;
    }

    private Long getAuthenticatedUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Object userId = session == null ? null : session.getAttribute("userId");
        return userId instanceof Long authenticatedUserId ? authenticatedUserId : null;
    }

    private record VideoResponse(
            Long id,
            String subject,
            String description,
            String source,
            String originalFileName,
            String videoLink,
            Long fileSizeBytes,
            LocalDateTime uploadedAt
    ) {
        private static VideoResponse from(VideoModel video) {
            return new VideoResponse(
                    video.getId(),
                    video.getSubject(),
                    video.getDescription(),
                    video.getSource(),
                    video.getOriginalFileName(),
                    video.getVideoLink(),
                    video.getFileSizeBytes(),
                    video.getUploadedAt()
            );
        }
    }
}
