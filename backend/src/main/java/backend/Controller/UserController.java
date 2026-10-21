package backend.Controller;

import backend.Model.UserModel;
import backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

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
        return userRepository.save(Newuser);
    }
}
