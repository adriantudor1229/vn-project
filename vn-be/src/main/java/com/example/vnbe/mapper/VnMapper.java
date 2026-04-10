package com.example.vnbe.mapper;

import com.example.vnbe.entity.Vn;
import com.example.vnbe.models.VnDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VnMapper {
    VnDTO toDto(Vn vn);

    @Mapping(target = "id", ignore = true)
    Vn toEntity(VnDTO vnDTO);
}
