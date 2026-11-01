package backend.Repository;


import backend.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface UserRepository  extends JpaRepository<UserModel,Long> {
    List<UserModel> findAllByEmail(String email);
}
