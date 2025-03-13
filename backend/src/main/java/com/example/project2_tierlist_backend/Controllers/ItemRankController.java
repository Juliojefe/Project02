package com.example.project2_tierlist_backend.Controllers;

import com.example.project2_tierlist_backend.models.ItemRank;
import com.example.project2_tierlist_backend.repository.ItemRankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itemranks")  // Base URL
public class ItemRankController {

    private final ItemRankRepository itemRankRepository;

    @Autowired
    public ItemRankController(ItemRankRepository itemRankRepository) {
        this.itemRankRepository = itemRankRepository;
    }

    @GetMapping
    public List<ItemRank> getAllItemRanks() {
        return itemRankRepository.findAll();
    }

    // 2. Get ItemRank by ID
    @GetMapping("/{id}")
    public ResponseEntity<ItemRank> getItemRankById(@PathVariable("id") int id) {
        return itemRankRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ItemRank createItemRank(@RequestBody ItemRank newItemRank) {
        return itemRankRepository.save(newItemRank);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemRank> updateItemRank(@PathVariable("id") int id,
                                                   @RequestBody ItemRank updatedItemRank) {
        return itemRankRepository.findById(id)
                .map(existingRank -> {
                    existingRank.setName(updatedItemRank.getName());
                    ItemRank savedRank = itemRankRepository.save(existingRank);
                    return ResponseEntity.ok(savedRank);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteItemRank(@PathVariable("id") int id) {
        return itemRankRepository.findById(id)
                .map(existingRank -> {
                    itemRankRepository.delete(existingRank);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
