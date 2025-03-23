package com.example.project2_tierlist_backend.Controllers;

import com.example.project2_tierlist_backend.dto.TierListCreationRequest;
import com.example.project2_tierlist_backend.dto.TierListRequest;
import com.example.project2_tierlist_backend.dto.TierListWithAssignments;
import com.example.project2_tierlist_backend.models.Subject;
import com.example.project2_tierlist_backend.models.TierItem;
import com.example.project2_tierlist_backend.models.TierList;
import com.example.project2_tierlist_backend.models.TierListItem;
import com.example.project2_tierlist_backend.repository.*;
import com.example.project2_tierlist_backend.services.TierListService;
import com.example.project2_tierlist_backend.dto.SimilarTierListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tierlists")
public class TierListController {

    @Autowired
    private TierListService tierListService;

    @Autowired
    private final TierListRepository tierListRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TierListItemRepository tierListItemRepository;

    @Autowired
    private TierItemRepository tierItemRepository;

    private static final Logger logger = LoggerFactory.getLogger(TierListController.class);


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
    //@PostMapping
    @PostMapping("/simple")
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

    @GetMapping("/subjects/current")
    public ResponseEntity<List<Subject>> getCurrentSubjects() {
        return ResponseEntity.ok(subjectRepository.findByIsCurrentTrue());
    }

    @GetMapping("/tier-items/subject/{subjectId}")
    public ResponseEntity<List<TierItem>> getTierItemsBySubjectId(@PathVariable Long subjectId) {
        return ResponseEntity.ok(tierItemRepository.findBySubjectId(subjectId));
    }

    @GetMapping("/user/{userId}/subject/{subjectId}")
    public ResponseEntity<TierListWithAssignments> getTierListByUserAndSubject(
            @PathVariable Integer userId, @PathVariable Long subjectId) {
        TierList tierList = tierListRepository.findByUserIdAndSubjectId(userId, subjectId);
        if (tierList != null) {
            List<TierListItem> assignments = tierListItemRepository.findByTierlistId((long) tierList.getTierlistId());
            TierListWithAssignments response = new TierListWithAssignments(tierList, assignments);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createTierList(@RequestBody TierListRequest request) {
        try {
            TierList tierList = tierListService.createTierList(
                    request.getUserId().longValue(),
                    request.getSubjectId().longValue(),
                    request.getAssignments()
            );
            return ResponseEntity.ok(tierList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{tierlistId}")
    public ResponseEntity<TierList> updateTierList(@PathVariable Integer tierlistId, @RequestBody TierListCreationRequest request) {
        // Find the existing tier list
        TierList existing = tierListRepository.findById(tierlistId)
                .orElseThrow(() -> new RuntimeException("TierList not found"));
        existing.setName(request.getName());
        // Clear old assignments
        tierListItemRepository.deleteByTierlistId((long) tierlistId);
        // Add new assignments
        List<TierListItem> newAssignments = request.getAssignments().stream()
                .map(assignment -> new TierListItem(tierlistId.longValue(), assignment.getItemId().longValue(), assignment.getRankId().longValue()))
                .collect(Collectors.toList());
        tierListItemRepository.saveAll(newAssignments);
        // Save the updated tier list
        tierListRepository.save(existing);
        return ResponseEntity.ok(existing);
    }

    // retrieves tier lists similar to a given user's tier list
    @GetMapping("/{userId}/subject/{subjectId}/similar")
    public List<SimilarTierListDTO> getSimilarTierLists(
            @PathVariable Integer userId,
            @PathVariable Long subjectId,
            @RequestParam(name = "minSimilarity", defaultValue = "0") int minSimilarity
    ) {
        return tierListService.getSimilarLists(userId, subjectId, minSimilarity);
    }
}
