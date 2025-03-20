package com.example.project2_tierlist_backend.components;

import com.example.project2_tierlist_backend.models.Subject;
import jakarta.annotation.PostConstruct;
import com.example.project2_tierlist_backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class SubjectInitializer {

    @Autowired
    private SubjectRepository subjectRepository;

    @PostConstruct
    public void initSubjects() {
        // Check if the database has any subjects
        if (subjectRepository.count() == 0) {
            // List of initial subjects
            List<String> initialSubjects = Arrays.asList(
                    "scary movies", "American muscle cars", "UFC Fighters", "Books", "Board Games", "Football Teams",
                    "Baseball teams", "Soccer teams", "heavy weight boxers", "European sports cars",
                    "Comedy Movies", "DC super heroes", "Marvel super heroes", "rappers", "country artists", "Anime Series",
                    "pixar movies", "Disney Movies", "RPG Video Games", "FPS Video Games", "Indie Games", "PlayStation Exclusives",
                    "Nintendo Games", "Xbox Exclusives", "Pokémon Starters", "Call of Duty Games", "Minecraft Mobs", "Pokémon Generations",
                    "Dragon Ball Sagas", "Attack on Titan Characters", "Anime Villains", "Rock Bands", "EDM Artists", "Video Game Soundtracks",
                    "TV Show Theme Songs", "Burger Chains", "Pizza Chains", "Fried Chicken Chains", "Soda Brands", "Candy Bars",
                    "Chips Brands", "Cereal Brands", "Sandwich Chains", "Desserts", "Breakfast Foods", "Energy Drinks", "NBA Players (All Time)",
                    "NFL Players (All Time)", "Soccer Players (All Time)", "World Leaders", "Dinosaurs", "Historical Empires", "Famous Paintings",
                    "Sneakers", "Nickelodeon Shows", "Disney Channel Shows", "Sci-Fi TV Shows", "Best Rap Albums", "Best country albums",
                    "Best Rock Albums", "Best Jazz Albums", "Best Twitch Streamers of All Time"
            );
            for (String name : initialSubjects) {
                Subject subject = new Subject();
                subject.setName(name);
                subject.setIsCurrent(false);
                subjectRepository.save(subject);
            }
        }
    }
}