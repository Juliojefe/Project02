package com.example.project2_tierlist_backend.dto;

import com.example.project2_tierlist_backend.models.TierList;

public class SimilarTierListDTO {
    private TierList tierList;
    private int similarity;  // percentage

    public SimilarTierListDTO(TierList tierList, int similarity) {
        this.tierList = tierList;
        this.similarity = similarity;
    }

    public TierList getTierList() {
        return tierList;
    }
    public int getSimilarity() {
        return similarity;
    }
}
