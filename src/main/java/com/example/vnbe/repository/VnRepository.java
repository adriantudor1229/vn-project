package com.example.vnbe.repository;

import com.example.vnbe.entity.Vn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface VnRepository extends JpaRepository<Vn, String> {

    @EntityGraph(attributePaths = {"titles"})
    Page<Vn> findAll(Pageable pageable);

    @Query("SELECT v FROM Vn v JOIN FETCH v.titles where v.id = :id")
    Optional<Vn> findByIdWithTitles(@Param("id") String id);
}
