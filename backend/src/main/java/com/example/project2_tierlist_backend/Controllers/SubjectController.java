package com.example.project2_tierlist_backend.Controllers;

import com.example.project2_tierlist_backend.models.Subject;
import com.example.project2_tierlist_backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepository;

    @Autowired
    public SubjectController(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    // get all subjects
    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    // get a subject by ID
    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        //Optional<Subject> subject = Optional.ofNullable(subjectRepository.findBySubjectId(id));
        Optional<Subject> subject = subjectRepository.findById(id);
        return subject.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // create a new subject
    @PostMapping
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject) {
        subject.setHasBeenUsed(false);
        Subject savedSubject = subjectRepository.save(subject);
        return new ResponseEntity<>(savedSubject, HttpStatus.CREATED);
    }

    // update a subject by ID
    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long id, @RequestBody Subject updatedSubject) {
        Optional<Subject> existingSubject = subjectRepository.findById(id);

        if (existingSubject.isPresent()) {
            Subject subject = existingSubject.get();
            subject.setName(updatedSubject.getName());
            subject.updateCurrent(updatedSubject.getCurrent());

            Subject savedSubject = subjectRepository.save(subject);
            return ResponseEntity.ok(savedSubject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // delete a subject by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        Optional<Subject> subject = subjectRepository.findById(id);
        if (subject.isPresent()) {
            subjectRepository.delete(subject.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/current")
    public List<Subject> getCurrentSubjects() {
        return subjectRepository.findByIsCurrentTrue();
    }
}
