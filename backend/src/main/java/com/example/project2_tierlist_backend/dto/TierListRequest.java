package com.example.project2_tierlist_backend.dto;

import java.util.List;

public class TierListRequest {
    private Long userId;
    private Long subjectId;
    private String name;
    private List<Assignment> assignments;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
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