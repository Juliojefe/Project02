package com.example.project2_tierlist_backend.Controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "TierList API is live!";
    }
}
