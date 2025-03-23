package com.example.project2_tierlist_backend.dto;

import java.util.List;

public class TierListCreationRequest {
    private String name;
    private List<Assignment> assignments;

    public TierListCreationRequest() {
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Assignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<Assignment> assignments) {
        this.assignments = assignments;
    }

    // Inner class for assignments
    public static class Assignment {
        private Integer itemId;
        private Integer rankId;

        // Default constructor
        public Assignment() {
        }

        // Getters and Setters
        public Integer getItemId() {
            return itemId;
        }

        public void setItemId(Integer itemId) {
            this.itemId = itemId;
        }

        public Integer getRankId() {
            return rankId;
        }

        public void setRankId(Integer rankId) {
            this.rankId = rankId;
        }
    }
}