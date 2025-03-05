package com.example.project2_tierlist_backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "TierList_Items")
public class TierListItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long tierlistId;

    @Column(nullable = false)
    private Long itemId;

    @Column(nullable = false)
    private Long rankId;

    public TierListItem() {}

    public TierListItem(Long tierlistId, Long itemId, Long rankId) {
        this.tierlistId = tierlistId;
        this.itemId = itemId;
        this.rankId = rankId;
    }

    public Long getId() { return id; }
    public Long getTierlistId() { return tierlistId; }
    public Long getItemId() { return itemId; }
    public Long getRankId() { return rankId; }

    public void setTierlistId(Long tierlistId) { this.tierlistId = tierlistId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public void setRankId(Long rankId) { this.rankId = rankId; }
}
