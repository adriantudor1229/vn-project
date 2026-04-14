package com.example.vnbe.entity;

import com.example.vnbe.models.VnTitlesId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vn_titles")
@IdClass(VnTitlesId.class)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class VnTitles {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", insertable = false, updatable = false)
    private Vn vn;

    @Id
    @Column(name = "lang",nullable = false)
    private String lang;

    @Column(name = "official")
    private Boolean official;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "latin")
    private String latin;
}
