package com.example.vnbe.models;

import com.example.vnbe.entity.enums.Language;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VnDTO {

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
