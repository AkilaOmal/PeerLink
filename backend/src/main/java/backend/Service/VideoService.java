package backend.Service;

import backend.Exception.UserNotFoundException;
import backend.Exception.VideoUploadException;
import backend.Model.UserModel;
import backend.Model.VideoModel;
import backend.Repository.UserRepository;
import backend.Repository.VideoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class VideoService {
    private static final long MAX_VIDEO_SIZE = 100L * 1024 * 1024;
    private static final int MAX_DESCRIPTION_LENGTH = 5000;
    private static final Set<String> ALLOWED_SUBJECTS = Set.of(
            "Computer Science",
            "Software Engineering",
            "Information Systems",
            "Object-Oriented Programming (OOP)",
            "Data Structures and Algorithms",
            "Database Systems",
            "Computer Networks",
            "Web Development",
            "Other"
    );
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".mp4", ".webm", ".mov", ".avi", ".mkv", ".mpeg", ".mpg", ".3gp", ".m4v", ".wmv", ".ogv"
    );

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final Path uploadDirectory;

    public VideoService(
            VideoRepository videoRepository,
            UserRepository userRepository,
            @Value("${app.upload.dir}") String uploadDirectory
    ) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    public VideoModel upload(
            Long userId,
            String subject,
            String description,
            String source,
            MultipartFile video,
            String videoLink
    ) {
        String normalizedSubject = requireText(subject, "Select a subject.", 100);
        if (!ALLOWED_SUBJECTS.contains(normalizedSubject)) {
            throw new VideoUploadException("Select a subject from the list.");
        }
        String normalizedDescription = requireText(description, "Enter a video description.", MAX_DESCRIPTION_LENGTH);
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        VideoModel videoModel = new VideoModel();
        videoModel.setSubject(normalizedSubject);
        videoModel.setDescription(normalizedDescription);
        videoModel.setUploadedBy(user);
        videoModel.setUploadedAt(LocalDateTime.now());

        if ("file".equals(source)) {
            if (videoLink != null && !videoLink.isBlank()) {
                throw new VideoUploadException("Choose either a video file or a video link, not both.");
            }
            return saveVideoFile(videoModel, video);
        }

        if ("link".equals(source)) {
            if (video != null && !video.isEmpty()) {
                throw new VideoUploadException("Choose either a video file or a video link, not both.");
            }
            videoModel.setSource("link");
            videoModel.setVideoLink(validateVideoLink(videoLink));
            return videoRepository.save(videoModel);
        }

        throw new VideoUploadException("Choose a valid video source.");
    }

    private VideoModel saveVideoFile(VideoModel videoModel, MultipartFile video) {
        if (video == null || video.isEmpty()) {
            throw new VideoUploadException("Select a video file.");
        }
        if (video.getSize() > MAX_VIDEO_SIZE) {
            throw new VideoUploadException("The video must be 100 MB or smaller.");
        }

        String contentType = video.getContentType();
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("video/")) {
            throw new VideoUploadException("The selected file must be a video.");
        }

        String originalFileName = getSafeOriginalFileName(video.getOriginalFilename());
        String extension = getAllowedExtension(originalFileName);
        String storedFileName = UUID.randomUUID() + extension;
        Path destination = uploadDirectory.resolve(storedFileName).normalize();
        if (!destination.startsWith(uploadDirectory)) {
            throw new VideoUploadException("Invalid video filename.");
        }

        try {
            Files.createDirectories(uploadDirectory);
            video.transferTo(destination);
        } catch (IOException | IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to store the video file.", exception);
        }

        videoModel.setSource("file");
        videoModel.setOriginalFileName(originalFileName);
        videoModel.setStoredFileName(storedFileName);
        videoModel.setContentType(contentType);
        videoModel.setFileSizeBytes(video.getSize());

        try {
            return videoRepository.save(videoModel);
        } catch (RuntimeException exception) {
            try {
                Files.deleteIfExists(destination);
            } catch (IOException cleanupException) {
                exception.addSuppressed(cleanupException);
            }
            throw exception;
        }
    }

    private String validateVideoLink(String videoLink) {
        if (videoLink == null || videoLink.isBlank() || videoLink.length() > 2048) {
            throw new VideoUploadException("Enter a valid video link.");
        }

        URI uri;
        try {
            uri = URI.create(videoLink.trim());
        } catch (IllegalArgumentException exception) {
            throw new VideoUploadException("Enter a valid video link.");
        }

        String scheme = uri.getScheme();
        if (uri.getHost() == null || scheme == null
                || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
            throw new VideoUploadException("The video link must be a valid HTTP or HTTPS URL.");
        }
        return uri.toString();
    }

    private String requireText(String value, String message, int maxLength) {
        if (value == null || value.isBlank() || value.trim().length() > maxLength) {
            throw new VideoUploadException(message);
        }
        return value.trim();
    }

    private String getSafeOriginalFileName(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new VideoUploadException("The video file must have a filename.");
        }
        String normalizedName = fileName.replace('\\', '/');
        String safeName = normalizedName.substring(normalizedName.lastIndexOf('/') + 1);
        if (safeName.length() > 255) {
            throw new VideoUploadException("The video filename must be 255 characters or fewer.");
        }
        return safeName;
    }

    private String getAllowedExtension(String fileName) {
        int extensionIndex = fileName.lastIndexOf('.');
        if (extensionIndex < 0) {
            throw new VideoUploadException("Use a supported video file extension.");
        }
        String extension = fileName.substring(extensionIndex).toLowerCase(Locale.ROOT);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new VideoUploadException("Use a supported video file extension.");
        }
        return extension;
    }
}
