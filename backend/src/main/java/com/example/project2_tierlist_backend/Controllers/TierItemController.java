package com.example.project2_tierlist_backend.Controllers;

import com.example.project2_tierlist_backend.models.TierItem;
import com.example.project2_tierlist_backend.repository.TierItemRepository;
import com.example.project2_tierlist_backend.services.TierItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tieritems")
public class TierItemController {

    @Autowired
    private TierItemRepository tierItemRepository;

    // Get all TierItems
    @GetMapping
    public List<TierItem> getAllTierItems() {
        return tierItemRepository.findAll();
    }

    // Get TierItem by ID
    @GetMapping("/{id}")
    public ResponseEntity<TierItem> getTierItemById(@PathVariable Integer id) {
        Optional<TierItem> tierItem = tierItemRepository.findById(id);
        return tierItem.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new TierItem
    @PostMapping
    public TierItem createTierItem(@RequestBody TierItem tierItem) {
        return tierItemRepository.save(tierItem);
    }

    // Update existing TierItem
    @PutMapping("/{id}")
    public ResponseEntity<TierItem> updateTierItem(@PathVariable Integer id, @RequestBody TierItem updatedTierItem) {
        return tierItemRepository.findById(id)
                .map(existingTierItem -> {
                    existingTierItem.setName(updatedTierItem.getName());
                    existingTierItem.setImage(updatedTierItem.getImage());
                    tierItemRepository.save(existingTierItem);
                    return ResponseEntity.ok(existingTierItem);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a TierItem
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTierItem(@PathVariable Integer id) {
        return tierItemRepository.findById(id)
                .map(tierItem -> {
                    tierItemRepository.delete(tierItem);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/populate-items")
    public String populateItems(@RequestParam String subject, @RequestParam int numItems) {
        TierItemService.populateItemsForSubject(subject, numItems);
        return "Items populated for subject: " + subject;
    }

    @GetMapping("/subject/{subjectId}")
    public List<TierItem> getTierItemsBySubjectId(@PathVariable Long subjectId) {
        return tierItemRepository.findBySubjectId(subjectId);
    }

}
