package com.example.vnbe.models;

import com.example.vnbe.entity.enums.Language;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VnDTO {

    private List<VnTitlesDTO> titles;
    private String image;
    private String cImage;
    private Language olang;
    private Integer cVotecount;
    private Short cRating;
    private Short cAverage;
    private Short cLength;
    private Short cLengthnum;
    private Short length;
    private Short devstatus;
    private String alias;
    private String description;
}
