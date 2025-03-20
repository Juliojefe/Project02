package com.example.project2_tierlist_backend.Controllers;

import com.example.project2_tierlist_backend.components.SubjectScheduler;
import com.example.project2_tierlist_backend.components.SubjectInitializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private SubjectScheduler subjectScheduler;

    @Autowired
    private SubjectInitializer subjectInitializer;

    @PostMapping("/trigger-scheduler")
    public String triggerScheduler() {
        subjectScheduler.updateCurrentSubjects();
        return "Scheduler triggered";
    }

    @PostMapping("/initialize-subjects")
    public String initializeSubjects() {
        subjectInitializer.initSubjects();
        return "Subjects initialized";
    }
}
