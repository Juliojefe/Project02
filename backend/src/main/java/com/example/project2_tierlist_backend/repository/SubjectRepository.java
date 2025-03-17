package com.example.project2_tierlist_backend.repository;

import com.example.project2_tierlist_backend.models.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByName(String name);
    Optional<Subject> findById(Long id);
}