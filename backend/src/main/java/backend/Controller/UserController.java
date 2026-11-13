package backend.Controller;

import backend.Model.UserModel;
import backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.Objects;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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

    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest servletRequest) {
        HttpSession session = servletRequest.getSession(false);
        Object userId = session == null ? null : session.getAttribute("userId");
        if (!(userId instanceof Long authenticatedUserId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return userRepository.findById(authenticatedUserId)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(
                        new UserProfileResponse(user.getFirstName(), user.getEmail())
                ))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpServletRequest servletRequest
    ) {
        HttpSession existingSession = servletRequest.getSession(false);
        if (existingSession != null) {
            existingSession.invalidate();
        }

        if (request.email() == null || request.password() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return userRepository.findAllByEmail(request.email()).stream()
                .filter(user -> Objects.equals(user.getPassword(), request.password()))
                .findFirst()
                .map(user -> {
                    HttpSession session = servletRequest.getSession(true);
                    session.setAttribute("userId", user.getId());
                    return ResponseEntity.ok(new LoginResponse(user.getId(), user.getRole()));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest servletRequest) {
        HttpSession session = servletRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.noContent().build();
    }

    public record LoginRequest(String email, String password) {}

    public record LoginResponse(Long id, String role) {}

    public record UserProfileResponse(String firstName, String email) {}

}
