# Project Status — Will the endpoints work?

**No.** There are several issues that will prevent the app from running correctly.

---

## Issues Found

### 1. Missing `LanguageConverter` (BLOCKER)
The `Vn` entity uses `@Enumerated(EnumType.STRING)` for the `olang` field, but the Java enum names (`PT_PT`, `ZH_HANS`) don't match the DB enum values (`pt-pt`, `zh-Hans`). Hibernate will fail to read/write these values.

**Fix:** Create a `LanguageConverter` implementing `AttributeConverter<Language, String>` (as described in `language.md`) and remove `@Enumerated(EnumType.STRING)` from the entity.

### 2. Missing `c_image` field in Entity (BLOCKER)
The `Vn` entity has no `cImage` field, but the database table has a `c_image` column. With `ddl-auto: validate`, Hibernate validates the entity against the DB schema — a missing column may cause validation to fail depending on strictness.

More importantly, the `VnDTO` has `c_image` but the entity doesn't, so the mapper can't map it.

**Fix:** Add `cImage` field to the `Vn` entity:
```java
@Column(name = "c_image")
private String cImage;
```

### 3. VnDTO field naming mismatches (BLOCKER)
The DTO uses snake_case field names (`c_image`, `c_voteCount`, `c_rating`, etc.) while the entity uses camelCase (`cImage`, `cVotecount`, `cRating`). MapStruct matches fields by name — these won't map automatically.

**Mismatched fields:**
| DTO field | Entity field | Match? |
|---|---|---|
| `c_image` | (missing) | No |
| `c_voteCount` | `cVotecount` | No (`Count` vs `count`) |
| `c_rating` | `cRating` | No |
| `c_average` | `cAverage` | No |
| `c_length` | `cLength` | No |
| `c_lengthnum` | `cLengthnum` | No |

**Fix:** Either rename the DTO fields to camelCase to match the entity, or add `@Mapping` annotations to the `VnMapper`.

### 4. Type mismatches between Entity and DTO
The entity uses `Short` for `cRating`, `cAverage`, `cLength`, `cLengthnum`, `length`, `devstatus` but the DTO uses `Integer` for all of them. MapStruct can auto-convert `Short` → `Integer`, so this won't crash, but it's inconsistent and could cause issues on `toEntity()` if an `Integer` value exceeds `Short` range.

**Fix:** Align the types — either use `Short` in the DTO or `Integer` in the entity.

### 5. No Flyway migrations (POTENTIAL BLOCKER)
Flyway is enabled in `application.yaml` with `locations: classpath:db/migration`, but there are no migration files. Flyway will start up and find nothing to run — this is fine if the DB schema already exists (which it does). But if Flyway's metadata table doesn't exist yet, it may conflict with `ddl-auto: validate`.

**Likely OK** since the DB is pre-populated, but worth noting.

### 6. `findAll()` with no pagination (PERFORMANCE)
The `vn` table likely has thousands of rows. `findAll()` will load every single row into memory. Not a crash, but will be very slow and memory-heavy.

**Fix:** Use `Pageable` and return `Page<VnDTO>` instead.

---

## What's Correct

- **Project structure** — Controller → Service → Repository layering is correct
- **Dependency injection** — `@RequiredArgsConstructor` with `final` fields everywhere
- **Repository** — `JpaRepository<Vn, String>` matches the text PK
- **Controller** — thin, delegates to service, correct annotations
- **Service** — interface + implementation pattern, proper use of `orElseThrow`
- **MapStruct setup** — `componentModel = "spring"` is correct
- **Lombok setup** — annotation processor order in `build.gradle` is correct

---

## Priority Fix Order

1. Create `LanguageConverter` → without it, any row with `pt-pt`, `pt-br`, `zh-Hans`, `zh-Hant` crashes
2. Add `cImage` to entity → missing column
3. Fix DTO field names or add `@Mapping` annotations → mapper won't work
4. Align `Short`/`Integer` types → consistency
5. Add pagination to `findAll()` → performance
