package com.example.project2_tierlist_backend.repository;

import com.example.project2_tierlist_backend.models.TierList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TierListRepository extends JpaRepository<TierList, Long> {
    List<TierList> findByUserId(Integer userId);
    TierList findByUserIdAndSubjectId(Long userId, Long subjectId);
    //Optional<TierList> findbyId(Integer tierlistId);
}
