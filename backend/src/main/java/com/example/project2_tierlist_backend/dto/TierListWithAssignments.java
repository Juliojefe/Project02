package com.example.project2_tierlist_backend.dto;

import com.example.project2_tierlist_backend.models.TierList;
import com.example.project2_tierlist_backend.models.TierListItem;

import java.util.List;

public class TierListWithAssignments {
    private TierList tierList;
    private List<TierListItem> assignments;

    public TierListWithAssignments(TierList tierList, List<TierListItem> assignments) {
        this.tierList = tierList;
        this.assignments = assignments;
    }

    public TierList getTierList() {
        return tierList;
    }

    public List<TierListItem> getAssignments() {
        return assignments;
    }
}
