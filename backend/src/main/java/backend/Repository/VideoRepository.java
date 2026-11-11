package backend.Repository;

import backend.Model.VideoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoRepository extends JpaRepository<VideoModel, Long> {
}
