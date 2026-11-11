package backend.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "videos")
@Getter
@Setter
@NoArgsConstructor
public class VideoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String subject;

    @Column(nullable = false, length = 5000)
    private String description;

    @Column(nullable = false, length = 10)
    private String source;

    @Column(name = "original_file_name", length = 255)
    private String originalFileName;

    @Column(name = "stored_file_name", length = 255)
    private String storedFileName;

    @Column(name = "video_link", length = 2048)
    private String videoLink;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel uploadedBy;
}
