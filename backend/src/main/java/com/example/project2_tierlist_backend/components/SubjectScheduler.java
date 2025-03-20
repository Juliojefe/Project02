package com.example.project2_tierlist_backend.components;

import com.example.project2_tierlist_backend.models.Subject;
import com.example.project2_tierlist_backend.models.TierItem;
import com.example.project2_tierlist_backend.repository.SubjectRepository;
import com.example.project2_tierlist_backend.repository.TierItemRepository;
import com.example.project2_tierlist_backend.services.SerpApiService.SerpApiService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;
import org.slf4j.Logger;

@Component
public class SubjectScheduler {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TierItemRepository tierItemRepository;

    @Autowired
    private SerpApiService serpApiService;

    private static final Logger logger = LoggerFactory.getLogger(SubjectScheduler.class);

    @Scheduled(cron = "0 0 0 * * MON") // runs every monday at midnight
    public void updateCurrentSubjects() {
        logger.info("Scheduler started");
        // set all subjects to isCurrent = false and hasBeenUsed = true
        List<Subject> currentSubjects = subjectRepository.findByIsCurrentTrue();
        for (Subject subject: currentSubjects) {
            subject.setIsCurrent(false);
            subject.setHasBeenUsed(true);
            subjectRepository.save(subject);
        }
        // fetch all subjects that haven't been used and pick 3 at random
        List<Subject> unusedSubjects = subjectRepository.findByHasBeenUsed(false);
        Collections.shuffle(unusedSubjects);
        List<Subject> newCurrentSubjects = unusedSubjects.subList(0, Math.min(3, unusedSubjects.size()));

        for (Subject subject : newCurrentSubjects) {
            subject.setIsCurrent(true); // mark subject as current
            subjectRepository.save(subject);
            List<TierItem> tierItems = serpApiService.fetchItems(subject.getName(), 6); // fetch and save new tier items
            for (TierItem item : tierItems) {
                item.setSubjectId(subject.getSubjectId());
            }
            tierItemRepository.saveAll(tierItems);
        }
    }
}