package com.example.project2_tierlist_backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.IntStream;

@Service
public class EmbeddingService {
    @Value("${openai.api.key}") private String apiKey;
    private final RestTemplate rest = new RestTemplate();
    private final Map<String, List<Double>> cache = new ConcurrentHashMap<>();

    public List<Double> getEmbedding(String text) {
        return cache.computeIfAbsent(text, t -> {
            Map<?,?> response = rest.postForObject(
                    "https://api.openai.com/v1/embeddings",
                    Map.of("model","text-embedding-3-small","input",t),
                    Map.class
            );
            Object first = ((List<?>) response.get("data")).get(0);
            return (List<Double>) ((Map<?,?>) first).get("embedding");
        });
    }

    public static List<Double> averageVectors(List<Double> a, List<Double> b) {
        return IntStream.range(0, a.size())
                .mapToObj(i -> (a.get(i) + b.get(i)) / 2.0)
                .toList();
    }

    public static double cosineSimilarity(List<Double> v1, List<Double> v2) {
        double dot = IntStream.range(0, v1.size()).mapToDouble(i -> v1.get(i)*v2.get(i)).sum();
        double mag1 = Math.sqrt(v1.stream().mapToDouble(x->x*x).sum());
        double mag2 = Math.sqrt(v2.stream().mapToDouble(x->x*x).sum());
        return (mag1==0||mag2==0)?0:dot/(mag1*mag2);
    }
}
