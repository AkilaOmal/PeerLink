package backend.Controller;

import backend.Model.UserModel;
import backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api")
public class UserController {
    @Autowired
    public UserRepository userRepository;
    @GetMapping("/")
    public String index() {
        return "index";
    }
    @PostMapping("/user")
    public UserModel createUser(@RequestBody UserModel Newuser){
        Newuser.setRole("USER");
        return userRepository.save(Newuser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request.email() == null || request.password() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return userRepository.findAllByEmail(request.email()).stream()
                .filter(user -> Objects.equals(user.getPassword(), request.password()))
                .findFirst()
                .map(user -> ResponseEntity.ok(new LoginResponse(user.getId(), user.getRole())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    public record LoginRequest(String email, String password) {}

    public record LoginResponse(Long id, String role) {}


}
