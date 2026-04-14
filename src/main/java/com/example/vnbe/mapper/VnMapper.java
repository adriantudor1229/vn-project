package com.example.vnbe.mapper;

import com.example.vnbe.entity.Vn;
import com.example.vnbe.entity.VnTitles;
import com.example.vnbe.models.VnDTO;
import com.example.vnbe.models.VnTitlesDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VnMapper {
    VnDTO toDto(Vn vn);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "titles", ignore = true)
    Vn toEntity(VnDTO vnDTO);

    VnTitlesDTO toTitlesDto(VnTitles vnTitles);
}
