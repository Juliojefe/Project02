package com.example.project2_tierlist_backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "TierItem")
public class TierItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itemId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String image;

    // Constructors
    public TierItem() {}

    public TierItem(String name, String image) {
        this.name = name;
        this.image = image;
    }

    // Getters and Setters
    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
