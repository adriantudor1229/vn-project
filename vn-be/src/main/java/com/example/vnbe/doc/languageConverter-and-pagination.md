# LanguageConverter & Pagination

## Still Blocking

### 1. No `LanguageConverter`
The entity uses `@Enumerated(EnumType.STRING)` but Java enum names like `PT_PT` don't match DB values like `pt-pt`. Any row with hyphenated languages will crash.

### 2. `findAll()` returns everything
No pagination — loads the entire `vn` table into memory.

---

## Fix 1: LanguageConverter

### Step A — Create the converter

**File:** `src/main/java/com/example/vnbe/entity/converters/LanguageConverter.java`

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

### How it works
- `convertToDatabaseColumn` — when saving, sends the real DB value (`"pt-br"`) not the Java name (`"PT_BR"`)
- `convertToEntityAttribute` — when reading, looks up the DB string and returns the matching enum
- `@Converter(autoApply = true)` — applies to every `Language` field automatically
- `CODE_MAP` — built once at class load, O(1) lookup instead of looping every time

### Step B — Remove `@Enumerated` from entity

In `Vn.java`, the `olang` field should change from:
```java
@Column(name = "olang", nullable = false, columnDefinition = "language")
@Enumerated(EnumType.STRING)
private Language olang;
```

To:
```java
@Column(name = "olang", nullable = false, columnDefinition = "language")
private Language olang;
```

Remove `@Enumerated(EnumType.STRING)` — the converter handles it now. If both are present, `@Enumerated` takes priority and the converter is ignored.

---

## Fix 2: Pagination

### Step A — Update VnService interface

```java
package com.example.vnbe.service;

import com.example.vnbe.models.VnDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VnService {
    Page<VnDTO> findAll(Pageable pageable);
    VnDTO findById(String id);
}
```

### Step B — Update VnServiceImpl

```java
@Override
public Page<VnDTO> findAll(Pageable pageable) {
    return vnRepository.findAll(pageable)
            .map(vnMapper::toDto);
}
```

`Page` has a `.map()` method built in — no need for `.stream().map().toList()`. It maps each entity to a DTO and preserves the pagination metadata (total count, page number, size).

### Step C — Update VnController

```java
@GetMapping
public Page<VnDTO> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
    return vnService.findAll(PageRequest.of(page, size));
}
```

The caller now controls pagination:
- `GET /api/vn` → page 0, 20 results (defaults)
- `GET /api/vn?page=2&size=10` → page 2, 10 results

### What `Page<VnDTO>` returns in JSON

```json
{
  "content": [ ... ],        // the VnDTO list for this page
  "totalElements": 31042,    // total rows in the table
  "totalPages": 1553,        // total pages (totalElements / size)
  "number": 0,               // current page number
  "size": 20,                // page size
  "first": true,             // is this the first page?
  "last": false              // is this the last page?
}
```

---

## After these fixes

All remaining issues from `project.md` are DTO field naming mismatches (`c_image` vs `cImage`, `c_voteCount` vs `cVotecount`). Those need either renaming the DTO fields to camelCase or adding `@Mapping` annotations in `VnMapper`.
