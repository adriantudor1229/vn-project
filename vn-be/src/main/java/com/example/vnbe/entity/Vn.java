package com.example.vnbe.entity;

import com.example.vnbe.entity.enums.Language;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vn")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vn {

    //didn't used @GeneratedValue, because there is already a db
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "image")
    private String image;

    @Column(name = "c_image")
    private String cImage;

    //need to create another class
    @Column(name = "olang", nullable = false, columnDefinition = "language")
    private Language olang;

    //it's using `c` because it's community rated
    @Column(name = "c_votecount", nullable = false)
    private Integer cVotecount;

    //it's using Short(wrapper) instead of short(primitive), because primitives can't be null
    //it maps to smalllintin Postgres
    @Column(name = "c_rating")
    private Short cRating;

    @Column(name = "c_average")
    private Short cAverage;

    @Column(name = "c_length")
    private Short cLength;

    @Column(name = "c_lengthnum",nullable = false)
    private Short cLengthnum;

    @Column(name = "length", nullable = false)
    private Short length;

    @Column(name = "devstatus", nullable = false)
    private Short devstatus;

    // without columnDefinition, Hibernate may use default varchar(255), which doesn't match the `text` type
    @Column(name = "alias", nullable = false, columnDefinition = "TEXT")
    private String alias;

    @Column(name = "description",nullable = false,columnDefinition = "TEXT")
    private String description;
}
