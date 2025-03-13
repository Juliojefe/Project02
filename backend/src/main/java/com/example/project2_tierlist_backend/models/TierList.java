package com.example.project2_tierlist_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "TierList")
public class TierList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tierlistId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private Integer userId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false, columnDefinition = "INT DEFAULT 1")
    private Integer status = 1;

    // Getters and Setters
    public Integer getTierlistId() {
        return tierlistId;
    }

    public void setTierlistId(Integer tierlistId) {
        this.tierlistId = tierlistId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
