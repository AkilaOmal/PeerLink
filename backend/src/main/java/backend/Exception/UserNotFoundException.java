package backend.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


import java.util.HashMap;
import java.util.Map;

public class UserNotFoundException extends RuntimeException {

    public  UserNotFoundException(Long id){
        super("User with id "+id+" not found");
    }
    public  UserNotFoundException(String message){
        super(message);
    }




}

