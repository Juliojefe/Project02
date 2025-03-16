package com.example.project2_tierlist_backend.services;

import com.example.project2_tierlist_backend.models.Subject;
import com.example.project2_tierlist_backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public Subject getOrCreateSubject(String name) {
        Optional<Subject> existingSubject = subjectRepository.findByName(name);
        if (existingSubject.isPresent()) {
            return existingSubject.get();
        } else {
            Subject newSubject = new Subject(name);
            return subjectRepository.save(newSubject);
        }
    }
}