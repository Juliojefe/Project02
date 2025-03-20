package com.example.project2_tierlist_backend.repository;

import com.example.project2_tierlist_backend.models.TierListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TierListItemRepository extends JpaRepository<TierListItem, Long> {
    List<TierListItem> findByTierlistId(Long tierlistId);
    void deleteByTierlistId(Long tierlistId);
}
