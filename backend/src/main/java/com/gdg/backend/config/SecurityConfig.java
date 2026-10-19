package com.gdg.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF (common for stateless REST APIs)
                .csrf(csrf -> csrf.disable())
                
                // 2. Configure Authorization Rules
                .authorizeHttpRequests(authz -> authz
                        // Allow health check and public GET requests
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                        
                        // All other requests (POST, PUT, DELETE) must be authenticated
                        .anyRequest().authenticated()
                )
                
                // 3. Configure HTTP Basic Authentication
                .httpBasic(Customizer.withDefaults())
                
                // 4. Make session stateless (no cookies)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }
}