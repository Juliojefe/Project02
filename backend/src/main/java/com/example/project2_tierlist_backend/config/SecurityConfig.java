package com.example.project2_tierlist_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/oauth2/**", "/auth/**", "/users/**").permitAll() // Allow OAuth endpoints
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/auth/login/success", true) // Redirect after login
                )
                .logout(logout -> logout.logoutSuccessUrl("/")) // Logout URL
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
