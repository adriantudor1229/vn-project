package com.example.vnbe.service;

import com.example.vnbe.entity.Vn;
import com.example.vnbe.mapper.VnMapper;
import com.example.vnbe.models.VnDTO;
import com.example.vnbe.repository.VnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class VnServiceImpl implements VnService {

    private final VnRepository vnRepository;
    private final VnMapper vnMapper;

    @Override
    public Page<VnDTO> findAll(Pageable pageable) {
        return vnRepository.findAll(pageable)
                .map(vnMapper::toDto);
    }

    @Override
    public VnDTO findById(String id) {
        Vn vn = vnRepository.findByIdWithTitles(id)
                .orElseThrow(() -> new RuntimeException("VN not found:" + id));
        return vnMapper.toDto(vn);
    }
}
