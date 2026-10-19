package com.gdg.backend.controller;

import com.gdg.backend.model.TeamMember;
import com.gdg.backend.repository.TeamMemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/team")
@CrossOrigin(origins = "*")
public class TeamController {

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @GetMapping
    public ResponseEntity<List<TeamMember>> getAllTeamMembers() {
        try {
            log.info("Fetching all team members");
            List<TeamMember> members = teamMemberRepository.findAllByOrderByDisplayOrderAsc();
            log.info("Found {} team members", members.size());
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            log.error("Error fetching team members: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamMember> getTeamMemberById(@PathVariable Long id) {
        try {
            log.info("Fetching team member with id: {}", id);
            return teamMemberRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching team member {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<TeamMember> createTeamMember(@RequestBody TeamMember member) {
        try {
            log.info("Creating new team member: {}", member.getName());
            TeamMember savedMember = teamMemberRepository.save(member);
            log.info("Team member created with id: {}", savedMember.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMember);
        } catch (Exception e) {
            log.error("Error creating team member: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamMember> updateTeamMember(@PathVariable Long id, @RequestBody TeamMember memberDetails) {
        try {
            log.info("Updating team member with id: {}", id);
            return teamMemberRepository.findById(id)
                    .map(member -> {
                        member.setName(memberDetails.getName());
                        member.setRole(memberDetails.getRole());
                        member.setDescription(memberDetails.getDescription());
                        member.setAvatar(memberDetails.getAvatar());
                        member.setLinkedin(memberDetails.getLinkedin());
                        member.setTwitter(memberDetails.getTwitter());
                        member.setGithub(memberDetails.getGithub());
                        member.setWebsite(memberDetails.getWebsite());
                        member.setTags(memberDetails.getTags());
                        member.setIsLeader(memberDetails.getIsLeader());
                        member.setDisplayOrder(memberDetails.getDisplayOrder());
                        TeamMember updatedMember = teamMemberRepository.save(member);
                        log.info("Team member updated: {}", id);
                        return ResponseEntity.ok(updatedMember);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error updating team member {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamMember(@PathVariable Long id) {
        try {
            log.info("Deleting team member with id: {}", id);
            if (teamMemberRepository.existsById(id)) {
                teamMemberRepository.deleteById(id);
                log.info("Team member deleted: {}", id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting team member {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/leaders")
    public ResponseEntity<List<TeamMember>> getLeaders() {
        try {
            log.info("Fetching team leaders");
            List<TeamMember> leaders = teamMemberRepository.findByIsLeaderTrue();
            return ResponseEntity.ok(leaders);
        } catch (Exception e) {
            log.error("Error fetching leaders: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<TeamMember>> getTeamMembersByRole(@PathVariable String role) {
        try {
            log.info("Fetching team members by role: {}", role);
            List<TeamMember> members = teamMemberRepository.findByRole(role);
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            log.error("Error fetching team members by role {}: {}", role, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
