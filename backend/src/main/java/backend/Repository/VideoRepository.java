package backend.Repository;

import backend.Model.VideoModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<VideoModel, Long> {
    List<VideoModel> findAllByOrderByUploadedAtDesc();
    List<VideoModel> findByUploadedBy_IdOrderByUploadedAtDesc(Long userId);
}
