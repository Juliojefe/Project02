package com.example.project2_tierlist_backend.Controllers;

import com.example.project2_tierlist_backend.models.TierList;
import com.example.project2_tierlist_backend.repository.TierListRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tierlists")
public class TierListController {

    private final TierListRepository tierListRepository;

    public TierListController(TierListRepository tierListRepository) {
        this.tierListRepository = tierListRepository;
    }

    // get all tier lists
    @GetMapping
    public List<TierList> getAllTierLists() {
        return tierListRepository.findAll();
    }

    //get a tier list by ID
    @GetMapping("/{id}")
    public ResponseEntity<TierList> getTierListById(@PathVariable Integer id) {
        Optional<TierList> tierList = tierListRepository.findById(id);
        return tierList.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    //get all tier lists for a specific user
    @GetMapping("/user/{userId}")
    public List<TierList> getTierListsByUserId(@PathVariable Integer userId) {
        return tierListRepository.findByUserId(userId);
    }

    //create a new tier list
    @PostMapping
    public TierList createTierList(@RequestBody TierList tierList) {
        return tierListRepository.save(tierList);
    }

    // update a tier list
    @PutMapping("/{id}")
    public ResponseEntity<TierList> updateTierList(@PathVariable Integer id, @RequestBody TierList updatedTierList) {
        return tierListRepository.findById(id)
                .map(tierList -> {
                    tierList.setName(updatedTierList.getName());
                    tierList.setUserId(updatedTierList.getUserId());
                    tierList.setStatus(updatedTierList.getStatus());
                    return ResponseEntity.ok(tierListRepository.save(tierList));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // delete a tier list
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTierList(@PathVariable Integer id) {
        if (tierListRepository.existsById(id)) {
            tierListRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
