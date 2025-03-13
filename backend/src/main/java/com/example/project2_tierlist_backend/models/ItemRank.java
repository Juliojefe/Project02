package com.example.project2_tierlist_backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ItemRank")
public class ItemRank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rankId;

    private String name;

    // Constructors
    public ItemRank() {
    }

    public ItemRank(String name) {
        this.name = name;
    }

    // Getters and setters
    public int getRankId() {
        return rankId;
    }

    public void setRankId(int rankId) {
        this.rankId = rankId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
