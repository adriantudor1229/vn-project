package com.example.vnbe.entity.converters;

import com.example.vnbe.entity.enums.Language;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Converter(autoApply = true)
public class LanguageConverter implements AttributeConverter<Language,String> {

    private static final Map<String, Language> CODE_MAP = Arrays.stream(Language.values())
            .collect(Collectors.toMap(Language::getCode, l -> l));

    @Override
    public String convertToDatabaseColumn(Language language) {
        return language == null ? null : language.getCode();
    }

    @Override
    public Language convertToEntityAttribute(String code) {
        return code == null ? null : CODE_MAP.get(code);
    }
}
