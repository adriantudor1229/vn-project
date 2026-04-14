# Language Enum

The `language` type in PostgreSQL is a custom enum with 58 values. Since Java enum constants can't contain hyphens (`-`), we need a mapping strategy.

---

## The Enum Class

```java
package com.example.vnbe.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Language {

    AR("ar"),
    BE("be"),
    BG("bg"),
    BS("bs"),
    CA("ca"),
    CS("cs"),
    CK("ck"),
    DA("da"),
    DE("de"),
    EL("el"),
    EN("en"),
    EO("eo"),
    ES("es"),
    ET("et"),
    EU("eu"),
    FA("fa"),
    FI("fi"),
    FR("fr"),
    GA("ga"),
    GL("gl"),
    GD("gd"),
    HE("he"),
    HI("hi"),
    HR("hr"),
    HU("hu"),
    ID("id"),
    IT("it"),
    IU("iu"),
    JA("ja"),
    KK("kk"),
    KO("ko"),
    MK("mk"),
    MS("ms"),
    NE("ne"),
    LA("la"),
    LT("lt"),
    LV("lv"),
    NL("nl"),
    NO("no"),
    PL("pl"),
    PT_PT("pt-pt"),
    PT_BR("pt-br"),
    RO("ro"),
    RU("ru"),
    SK("sk"),
    SL("sl"),
    SR("sr"),
    SV("sv"),
    TA("ta"),
    TH("th"),
    TR("tr"),
    UK("uk"),
    UR("ur"),
    VI("vi"),
    ZH("zh"),
    ZH_HANS("zh-Hans"),
    ZH_HANT("zh-Hant");

    private final String code;
}
```

---

## Why This Structure

### Problem: Hyphens in enum names
Java enum constants only allow letters, digits, and underscores. Three DB values contain hyphens:
- `pt-pt` → `PT_PT`
- `pt-br` → `PT_BR`
- `zh-Hans` → `ZH_HANS`
- `zh-Hant` → `ZH_HANT`

So we can't use `@Enumerated(EnumType.STRING)` directly — it would send `PT_PT` to the DB instead of `pt-pt`.

### Solution: `code` field + converter
Each constant holds its real DB value in the `code` field. Then we use a **JPA AttributeConverter** to translate between Java and the database.

---

## The Converter

```java
package com.example.vnbe.entity.converters;

import com.example.vnbe.entity.enums.Language;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Converter(autoApply = true)
public class LanguageConverter implements AttributeConverter<Language, String> {

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
```

### What this does
- **`convertToDatabaseColumn`** — when saving, sends the real DB value (e.g., `"pt-br"`) not the Java name (`"PT_BR"`)
- **`convertToEntityAttribute`** — when reading, looks up the DB string in the map and returns the matching Java enum
- **`@Converter(autoApply = true)`** — automatically applies to every `Language` field in every entity, no need to annotate each field individually

---

## Usage in the Vn Entity

With `autoApply = true` on the converter, the field just needs:

```java
@Column(name = "olang", nullable = false, columnDefinition = "language")
private Language olang;
```

No `@Enumerated` and no `@Convert` needed — the converter kicks in automatically.

---

## All 58 Values

| Java Constant | DB Value | Language |
|---|---|---|
| AR | ar | Arabic |
| BE | be | Belarusian |
| BG | bg | Bulgarian |
| BS | bs | Bosnian |
| CA | ca | Catalan |
| CS | cs | Czech |
| CK | ck | Cherokee |
| DA | da | Danish |
| DE | de | German |
| EL | el | Greek |
| EN | en | English |
| EO | eo | Esperanto |
| ES | es | Spanish |
| ET | et | Estonian |
| EU | eu | Basque |
| FA | fa | Persian |
| FI | fi | Finnish |
| FR | fr | French |
| GA | ga | Irish |
| GL | gl | Galician |
| GD | gd | Scottish Gaelic |
| HE | he | Hebrew |
| HI | hi | Hindi |
| HR | hr | Croatian |
| HU | hu | Hungarian |
| ID | id | Indonesian |
| IT | it | Italian |
| IU | iu | Inuktitut |
| JA | ja | Japanese |
| KK | kk | Kazakh |
| KO | ko | Korean |
| MK | mk | Macedonian |
| MS | ms | Malay |
| NE | ne | Nepali |
| LA | la | Latin |
| LT | lt | Lithuanian |
| LV | lv | Latvian |
| NL | nl | Dutch |
| NO | no | Norwegian |
| PL | pl | Polish |
| PT_PT | pt-pt | Portuguese (Portugal) |
| PT_BR | pt-br | Portuguese (Brazil) |
| RO | ro | Romanian |
| RU | ru | Russian |
| SK | sk | Slovak |
| SL | sl | Slovenian |
| SR | sr | Serbian |
| SV | sv | Swedish |
| TA | ta | Tamil |
| TH | th | Thai |
| TR | tr | Turkish |
| UK | uk | Ukrainian |
| UR | ur | Urdu |
| VI | vi | Vietnamese |
| ZH | zh | Chinese |
| ZH_HANS | zh-Hans | Chinese (Simplified) |
| ZH_HANT | zh-Hant | Chinese (Traditional) |
