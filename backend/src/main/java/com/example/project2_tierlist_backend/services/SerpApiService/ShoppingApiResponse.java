package com.example.project2_tierlist_backend.services.SerpApiService;

import java.util.List;

public class ShoppingApiResponse {
    private List<ShoppingResult> shoppingResults;

    public List<ShoppingResult> getShoppingResults() {
        return shoppingResults;
    }

    public void setShoppingResults(List<ShoppingResult> shoppingResults) {
        this.shoppingResults = shoppingResults;
    }
}
