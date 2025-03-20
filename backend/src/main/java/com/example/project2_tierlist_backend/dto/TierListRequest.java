package com.example.project2_tierlist_backend.dto;

import java.util.List;

public class TierListRequest {
    private Integer userId;
    private Integer subjectId;
    private String name;
    private List<Assignment> assignments;

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Integer getSubjectId() { return subjectId; }
    public void setSubjectId(Integer subjectId) { this.subjectId = subjectId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Assignment> getAssignments() { return assignments; }
    public void setAssignments(List<Assignment> assignments) { this.assignments = assignments; }

    public static class Assignment {
        private Integer itemId;
        private Integer rankId;

        public Integer getItemId() { return itemId; }
        public void setItemId(Integer itemId) { this.itemId = itemId; }
        public Integer getRankId() { return rankId; }
        public void setRankId(Integer rankId) { this.rankId = rankId; }
    }
}