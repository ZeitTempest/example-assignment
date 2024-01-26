package com.tmsjsb.redpanda.Controller;

import com.tmsjsb.redpanda.Service.UserService;
import com.tmsjsb.redpanda.Entity.UserEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.converter.json.MappingJacksonValue;

@RestController
public class UserAuthController {

  private final UserService userService;

    private UserAuthController(UserService userService) {
        this.userService = userService;
    }

  @PostMapping("/auth/login")
  public MappingJacksonValue Authlogin(@RequestBody UserEntity user) {
    return userService.login(user.getUsername(), user.getPassword());
  }

  
  
} 
