package com.example.project2_tierlist_backend.repository;

import com.example.project2_tierlist_backend.models.TierItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TierItemRepository extends JpaRepository<TierItem, Integer> {
    List<TierItem> findBySubjectId(Long subjectId);
    void deleteBySubjectId(Long subjectId);
    TierItem findByNameAndSubjectId(String name, Long subjectId);
}
