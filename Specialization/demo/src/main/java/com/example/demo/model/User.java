package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User {
  
  @Id
  private String username;

  private String password;
  private String email;

  @Column(name = "activestatus")
  private Integer activeStatus;


  public User() {
  }

  public User(String username, String password, String email, Integer activeStatus) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.activeStatus = activeStatus;
  }


  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return this.password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getEmail() {
    return this.email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Integer getActiveStatus() {
    return this.activeStatus;
  }

  public void setActiveStatus(Integer activeStatus) {
    this.activeStatus = activeStatus;
  }


}
