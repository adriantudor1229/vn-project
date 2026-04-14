package com.example.vnbe.service;

import com.example.vnbe.models.VnDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface VnService {
    Page<VnDTO> findAll (Pageable pageable);
    VnDTO findById(String id);

}
