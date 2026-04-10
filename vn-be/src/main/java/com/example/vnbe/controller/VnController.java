package com.example.vnbe.controller;

import com.example.vnbe.models.VnDTO;
import com.example.vnbe.service.VnService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vn")
@RequiredArgsConstructor
public class VnController {

    private final VnService vnService;

    @GetMapping
    public Page<VnDTO> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ){
        return vnService.findAll(PageRequest.of(page,size));
    }

    @GetMapping("/{id}")
    public VnDTO findById(@PathVariable String id) {
        return vnService.findById(id);
    }
}
