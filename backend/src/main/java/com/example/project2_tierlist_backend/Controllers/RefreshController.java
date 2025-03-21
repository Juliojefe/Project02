package com.example.project2_tierlist_backend.Controllers;

import com.example.project2_tierlist_backend.components.SubjectScheduler;
import com.example.project2_tierlist_backend.models.Subject;
import com.example.project2_tierlist_backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class RefreshController {

    @Autowired
    private SubjectScheduler subjectScheduler;

    @Autowired
    private SubjectRepository subjectRepository;

    // Manually refresh subjects and repopulate TierItems.
    // curl -X POST "http://localhost:8080/admin/refresh-subjects"
    @PostMapping("/refresh-subjects")
    public ResponseEntity<String> refreshSubjects() {
        System.out.println("Refresh endpoint called.");
        subjectScheduler.updateCurrentSubjects();
        return ResponseEntity.ok("Subjects refreshed and new Tier Items have been fetched.");
    }

    // Sets hasBeenUsed from true to falkse
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
}
