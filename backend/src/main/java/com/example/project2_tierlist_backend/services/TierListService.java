package com.example.project2_tierlist_backend.services;

import com.example.project2_tierlist_backend.dto.TierListRequest;
import com.example.project2_tierlist_backend.models.*;
import com.example.project2_tierlist_backend.repository.*;
import com.example.project2_tierlist_backend.dto.SimilarTierListDTO;
import com.example.project2_tierlist_backend.services.EmbeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Collections;
import java.util.Map;
import java.util.ArrayList;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TierListService {

    @Autowired
    private TierListItemRepository tierListItemRepository;

    @Autowired
    private TierListRepository tierListRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TierItemRepository tierItemRepository;

    @Autowired
    private ItemRankRepository itemRankRepository;

    @Autowired private EmbeddingService embed;

    public TierList createTierList(Long userId, Long subjectId, List<TierListRequest.Assignment> assignments) {
        // Validate user and subject
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        if (!subjectRepository.existsById(subjectId)) {
            throw new RuntimeException("Subject not found");
        }

        // Create and save the TierList
        TierList tierList = new TierList();
        tierList.setName("My Tier List"); // Use request.getName() if dynamic
        tierList.setUserId(userId.intValue());
        tierList.setSubjectId(subjectId);
        tierList = tierListRepository.save(tierList);

        // Create TierList_Items entries
        for (TierListRequest.Assignment assignment : assignments) {
            Integer itemId = assignment.getItemId();
            Integer rankId = assignment.getRankId();

            if (!tierItemRepository.existsById(itemId)) {
                throw new RuntimeException("Item ID " + itemId + " not found");
            }
            if (!itemRankRepository.existsById(rankId)) {
                throw new RuntimeException("Rank ID " + rankId + " not found");
            }

            TierListItem tierListItem = new TierListItem();
            tierListItem.setTierlistId(tierList.getTierlistId().longValue());
            tierListItem.setItemId(itemId.longValue());
            tierListItem.setRankId(rankId.longValue());
            tierListItemRepository.save(tierListItem);
        }

        return tierList;
    }
    public TierList createOrUpdateTierList(Long userId, Long subjectId, List<TierListRequest.Assignment> assignments) {
        // Validate user and subject
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        if (!subjectRepository.existsById(subjectId)) {
            throw new RuntimeException("Subject not found");
        }

        // Get subject name for tier list name
        String subjectName = subjectRepository.findById(subjectId)
                .map(Subject::getName)
                .orElse("Untitled");
        String tierListName = "Tier List for " + subjectName;

        TierList existingTierList = tierListRepository.findByUserIdAndSubjectId(userId.intValue(), subjectId);
        if (existingTierList != null) {
            // Update existing tier list
            existingTierList.setName(tierListName); // Ensure name is updated
            tierListRepository.save(existingTierList);

            // Replace assignments
            tierListItemRepository.deleteByTierlistId((long) existingTierList.getTierlistId());
            for (TierListRequest.Assignment assignment : assignments) {
                if (!tierItemRepository.existsById(assignment.getItemId())) {
                    throw new RuntimeException("Item ID " + assignment.getItemId() + " not found");
                }
                if (!itemRankRepository.existsById(assignment.getRankId())) {
                    throw new RuntimeException("Rank ID " + assignment.getRankId() + " not found");
                }
                TierListItem tierListItem = new TierListItem();
                tierListItem.setTierlistId((long) existingTierList.getTierlistId());
                tierListItem.setItemId((long) assignment.getItemId());
                tierListItem.setRankId((long) assignment.getRankId());
                tierListItemRepository.save(tierListItem);
            }
            return existingTierList;
        } else {
            // Create new tier list
            TierList newTierList = new TierList();
            newTierList.setName(tierListName);
            newTierList.setUserId(userId.intValue());
            newTierList.setSubjectId(subjectId);
            newTierList = tierListRepository.save(newTierList);

            // Add assignments
            for (TierListRequest.Assignment assignment : assignments) {
                if (!tierItemRepository.existsById(assignment.getItemId())) {
                    throw new RuntimeException("Item ID " + assignment.getItemId() + " not found");
                }
                if (!itemRankRepository.existsById(assignment.getRankId())) {
                    throw new RuntimeException("Rank ID " + assignment.getRankId() + " not found");
                }
                TierListItem tierListItem = new TierListItem();
                tierListItem.setTierlistId((long) newTierList.getTierlistId());
                tierListItem.setItemId((long) assignment.getItemId());
                tierListItem.setRankId((long) assignment.getRankId());
                tierListItemRepository.save(tierListItem);
            }
            return newTierList;
        }
    }

    public List<SimilarTierListDTO> getSimilarLists(Integer userId, Long subjectId, int minSimilarity) {
        TierList userTier = tierListRepository.findByUserIdAndSubjectId(userId, subjectId);
        if (userTier == null) return Collections.emptyList();

        List<TierListItem> userItems = tierListItemRepository.findByTierlistId(userTier.getTierlistId().longValue());
        List<Double> userVec = userItems.stream()
                .map(i -> tierItemRepository.findById(i.getItemId().intValue()).orElseThrow().getName())
                .map(embed::getEmbedding)
                .reduce(EmbeddingService::averageVectors)
                .orElseThrow();

        List<TierList> allLists = tierListRepository.findBySubjectId(subjectId);
        List<SimilarTierListDTO> results = new ArrayList<>();

        for (TierList other : allLists) {
            if (other.getTierlistId().equals(userTier.getTierlistId())) continue;

            List<Double> otherVec = tierListItemRepository.findByTierlistId(other.getTierlistId().longValue())
                    .stream()
                    .map(i -> tierItemRepository.findById(i.getItemId().intValue()).orElseThrow().getName())
                    .map(embed::getEmbedding)
                    .reduce(EmbeddingService::averageVectors)
                    .orElse(List.of());

            double sim = EmbeddingService.cosineSimilarity(userVec, otherVec) * 100;
            if (sim >= minSimilarity) {
                results.add(new SimilarTierListDTO(other, (int) sim));
            }
        }
        return results;
    }
}