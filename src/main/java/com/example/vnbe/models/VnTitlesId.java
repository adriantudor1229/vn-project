package com.example.vnbe.models;

import lombok.Data;

import java.io.Serializable;

@Data
public class VnTitlesId implements Serializable {
    private String vn;
    private String lang;
}
