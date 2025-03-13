package com.example.project2_tierlist_backend.repository;

import com.example.project2_tierlist_backend.models.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    Subject findBySubjectId(Long subjectId);
}