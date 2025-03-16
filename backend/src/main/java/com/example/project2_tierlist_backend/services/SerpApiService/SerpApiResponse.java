package com.example.project2_tierlist_backend.services.SerpApiService;

import java.util.List;

class SerpApiResponse {
    private List<OrganicResult> organic_results;

    public List<OrganicResult> getOrganicResults() {
        return organic_results;
    }

    public void setOrganic_results(List<OrganicResult> organic_results) {
        this.organic_results = organic_results;
    }
}