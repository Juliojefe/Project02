package com.example.project2_tierlist_backend.Controllers;

import com.example.project2_tierlist_backend.components.SubjectInitializer;
import com.example.project2_tierlist_backend.components.SubjectScheduler;
import com.example.project2_tierlist_backend.models.Subject;
import com.example.project2_tierlist_backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;


import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private SubjectScheduler subjectScheduler;

    @Autowired
    private SubjectInitializer subjectInitializer;

    @Autowired
    private SubjectRepository subjectRepository;

    // Manually trigger the scheduler to refresh subjects and repopulate TierItems.
    // curl -X POST "http://localhost:8080/admin/trigger-scheduler
    @PostMapping("/trigger-scheduler")
    public ResponseEntity<String> triggerScheduler() {
        System.out.println("Refresh endpoint called.");
        subjectScheduler.updateCurrentSubjects();
        return ResponseEntity.ok("Subjects refreshed and new Tier Items have been fetched.");
    }

    // Sets hasBeenUsed from true to false
    // curl -X POST "http://localhost:8080/admin/reset-subjects"
    @PostMapping("/reset-subjects")
    public ResponseEntity<String> resetSubjects() {
        List<Subject> usedSubjects = subjectRepository.findByHasBeenUsed(true);
        for (Subject subject : usedSubjects) {
            subject.setHasBeenUsed(false);
            subjectRepository.save(subject);
        }
        return ResponseEntity.ok("Reset " + usedSubjects.size() + " subjects to unused.");
    }

    @PostMapping("/initialize-subjects")
    public String initializeSubjects() {
        subjectInitializer.initSubjects();
        return "Subjects initialized";
    }
}
