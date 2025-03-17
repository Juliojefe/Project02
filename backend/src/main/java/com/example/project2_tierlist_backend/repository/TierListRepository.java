package com.example.project2_tierlist_backend.repository;

import com.example.project2_tierlist_backend.models.TierList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TierListRepository extends JpaRepository<TierList, Integer> {
    List<TierList> findByUserId(Integer userId);
}
