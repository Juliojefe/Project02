package com.example.project2_tierlist_backend.services;

import com.example.project2_tierlist_backend.models.Subject;
import com.example.project2_tierlist_backend.models.TierItem;
import com.example.project2_tierlist_backend.repository.TierItemRepository;
import com.example.project2_tierlist_backend.services.SerpApiService.SerpApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TierItemService {

    @Autowired
    private static SubjectService subjectService;

    @Autowired
    private static SerpApiService serpApiService;

    @Autowired
    private static TierItemRepository tierItemRepository;

    public static void populateItemsForSubject(String subjectName, int numItems) {
        Subject subject = subjectService.getOrCreateSubject(subjectName);
        List<TierItem> items = serpApiService.fetchItems(subjectName, numItems);
        for (TierItem item : items) {
            item.setSubjectId(subject.getSubjectId());
        }
        tierItemRepository.saveAll(items);
    }

    public TierItem getTierItemByNameAndSubject(String name, Long subjectId) {
        return tierItemRepository.findByNameAndSubjectId(name, subjectId);
    }
}