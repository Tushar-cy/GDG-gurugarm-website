package com.gdg.backend.repository;

import com.gdg.backend.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findAllByOrderByDisplayOrderAsc();
    List<TeamMember> findByIsLeaderTrue();
    List<TeamMember> findByRole(String role);
}
