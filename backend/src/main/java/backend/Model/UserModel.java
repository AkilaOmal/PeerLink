package backend.Model;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class UserModel {
    @Id
    @GeneratedValue
    private Long id;


    private String firstName;

    private String lastName;

    private String email;
    private String password;
    @Column(nullable = false)
    private String role="USER";
}
