package com.example.project2_tierlist_backend.services;

import com.example.project2_tierlist_backend.models.ItemRank;
import com.example.project2_tierlist_backend.models.TierItem;
import com.example.project2_tierlist_backend.repository.ItemRankRepository;
import com.example.project2_tierlist_backend.repository.TierItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ItemRankService {

    @Autowired
    private ItemRankRepository itemRankRepository;

    @Autowired
    private TierItemRepository tierItemRepository;

    public ItemRank getItemRankByName(String name) {
        return itemRankRepository.findByName(name);
    }

    public TierItem getTierItemByNameAndSubject(String name, Long subjectId) {
        return tierItemRepository.findByNameAndSubjectId(name, subjectId);
    }
}