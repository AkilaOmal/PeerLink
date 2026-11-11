package backend.Controller;

import backend.Model.VideoModel;
import backend.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
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
        HttpSession session = servletRequest.getSession(false);
        Object userId = session == null ? null : session.getAttribute("userId");
        if (!(userId instanceof Long authenticatedUserId)) {
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
