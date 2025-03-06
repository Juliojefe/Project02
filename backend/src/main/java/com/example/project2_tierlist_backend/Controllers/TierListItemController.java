package com.example.project2_tierlist_backend.controllers;

import com.example.project2_tierlist_backend.models.TierListItem;
import com.example.project2_tierlist_backend.repository.TierListItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/tierlist_items")
@CrossOrigin(origins = "http://localhost:8081")
public class TierListItemController {

    @Autowired
    private TierListItemRepository tierListItemRepository;

    @PostMapping("/")
    public ResponseEntity<TierListItem> addTierListItem(@RequestBody TierListItem tierListItem) {
        TierListItem savedItem = tierListItemRepository.save(tierListItem);
        return ResponseEntity.ok(savedItem);
    }

    @GetMapping("/{tierlistId}")
    public ResponseEntity<List<TierListItem>> getItemsByTierlist(@PathVariable Long tierlistId) {
        return ResponseEntity.ok(tierListItemRepository.findByTierlistId(tierlistId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTierListItem(@PathVariable Long id) {
        if (tierListItemRepository.existsById(id)) {
            tierListItemRepository.deleteById(id);
            return ResponseEntity.ok("✅ Tier list item deleted successfully!");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
