package com.example.project2_tierlist_backend.models;

import jakarta.persistence.*;
import java.time.Instant;


@Entity
@Table(name = "Subject")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subjectId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean isCurrent;

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    public Subject(){
        name = "no defined subject";
        isCurrent = false;
        onCreate();
    }

    public Subject(String name) {
        this.name = name;
        isCurrent = false;
        onCreate();
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String newName) {
        this.name = newName;
    }

    public boolean getCurrent() {
        return isCurrent;
    }

    public void updateCurrent(boolean newCurr) {
        this.isCurrent = newCurr;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}