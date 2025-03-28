package com.example.project2_tierlist_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
//                         .requestMatchers("/", "/oauth2/**", "/auth/**", "/users/**", "/users/register", "/users/login",
//                                 "/users/forgot-password", "/users/update-password", "/api/**", "/tierlists/**", "/api/tierlists/**").permitAll()
//                         .anyRequest().authenticated()
                )
<<<<<<< HEAD
                .csrf(csrf -> csrf.disable())
                .oauth2Login(oauth2 -> oauth2.defaultSuccessUrl("/auth/login/success", true))
                .logout(logout -> logout.logoutSuccessUrl("/")); // Logout URL
=======
//                .oauth2Login(oauth2 -> oauth2
//                        .defaultSuccessUrl("/auth/login/success", true) // Redirect after login
//                )
                .logout(logout -> logout.logoutSuccessUrl("/")) // Logout URL
                .csrf(csrf -> csrf.disable());

>>>>>>> a7b572f ( UI test)
        return http.build();
    }

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:8081") // allow requests from your Expo/web dev server
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*"); // permit all headers
            }
        };
    }
}
