package com.example.project2_tierlist_backend.services.SerpApiService;

import com.example.project2_tierlist_backend.models.TierItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class SerpApiService {

    @Value("${serpapi.key}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;

    public List<TierItem> fetchItems(String subject, int numItems) {
        String query = "top " + subject + " 2024";
        String url = "https://serpapi.com/search?engine=google&q=" + query + "&api_key=" + apiKey;
        try {
            ResponseEntity<SerpApiResponse> response = restTemplate.getForEntity(url, SerpApiResponse.class);
            SerpApiResponse data = response.getBody();
            if (data == null || data.getOrganicResults() == null) {
                return new ArrayList<>();
            }
            List<TierItem> items = new ArrayList<>();
            for (OrganicResult result : data.getOrganicResults()) {
                if (result.getTitle() != null && result.getThumbnail() != null) {
                    items.add(new TierItem(result.getTitle(), result.getThumbnail()));
                }
                if (items.size() >= numItems) break;
            }
            return items;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}