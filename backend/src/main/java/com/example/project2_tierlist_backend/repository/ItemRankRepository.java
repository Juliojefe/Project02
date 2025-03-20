package com.example.project2_tierlist_backend.repository;

import com.example.project2_tierlist_backend.models.ItemRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRankRepository extends JpaRepository<ItemRank, Integer> {

    ItemRank findByName(String name);

    List<ItemRank> findByNameContaining(String substring);

    List<ItemRank> findByNameContainingIgnoreCase(String substring);

    List<ItemRank> findByNameStartingWith(String prefix);

    @Query("SELECT r FROM ItemRank r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ItemRank> searchByName(@Param("keyword") String keyword);

    List<ItemRank> findByRankIdBetween(int start, int end);

    List<ItemRank> findByRankIdLessThanEqual(int maxId);

    List<ItemRank> findByRankIdGreaterThanEqual(int minId);

}
