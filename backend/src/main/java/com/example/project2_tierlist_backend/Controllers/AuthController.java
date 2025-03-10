package com.example.project2_tierlist_backend.controllers;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @GetMapping("/login/success")
    public Map<String, Object> loginSuccess(OAuth2AuthenticationToken token) {
        return token.getPrincipal().getAttributes(); // Returns user info as JSON
    }

    @GetMapping("/logout")
    public String logout() {
        return "You have been logged out.";
    }
}
