# VnTitles — Joining Tables & Field Selection

## The Problem

We have two tables:
- `vn` — the main visual novel data (id, image, rating, description, etc.)
- `vn_titles` — one row per language per VN (id, lang, official, title, latin)

A single VN can have many titles (English, Japanese, Chinese, etc.). We need to:
1. **JOIN** them so one API call returns a VN with all its titles
2. Let the **frontend choose** which fields to include in the response

---

## 1. Composite Primary Key (VnTitles has two PKs)

The `vn_titles` table has a **composite primary key**: `(id, lang)`. A single `@Id` on `id` is wrong — JPA needs to know about both columns.

### Option A: `@IdClass` (simpler, what we use)

Create a separate ID class:

```java
// This is just a "key holder" — not an entity, not stored anywhere.
// JPA uses it internally to identify rows in vn_titles.
public class VnTitlesId implements Serializable {
    private String id;
    private Language language;
    // equals() and hashCode() are REQUIRED — JPA uses them to compare keys
}
```

Then the entity uses `@IdClass` and puts `@Id` on **both** fields:

```java
@Entity
@Table(name = "vn_titles")
@IdClass(VnTitlesId.class)
public class VnTitles {
    @Id
    private String id;        // part 1 of composite key

    @Id
    @Column(name = "lang")
    private Language language; // part 2 of composite key

    private Boolean official;
    private String title;
    private String latin;
}
```

### Option B: `@EmbeddedId` (alternative)

Embed the key directly:

```java
@Embeddable
public class VnTitlesId implements Serializable {
    private String id;
    @Column(name = "lang")
    private Language language;
}

@Entity
public class VnTitles {
    @EmbeddedId
    private VnTitlesId id;
    // other fields...
}
```

**Trade-off**: `@EmbeddedId` groups keys nicely but makes field access more nested (`title.getId().getId()`). `@IdClass` keeps fields flat.

### Why `Serializable`?

JPA spec requires composite key classes to implement `Serializable`. This is because JPA may need to serialize the key for caching, detaching entities, or passing them between layers.

### Why `equals()` and `hashCode()`?

JPA uses these to determine if two entities represent the same row. Without them, two `VnTitlesId` objects with the same `id` + `language` would be considered different objects, breaking lookups, caching, and `Set` operations.

---

## 2. The JPA Relationship (`@OneToMany` / `@ManyToOne`)

### On the Vn entity (the "one" side):

```java
@Entity
@Table(name = "vn")
public class Vn {
    @Id
    private String id;

    // One VN has many titles
    @OneToMany(mappedBy = "vn", fetch = FetchType.LAZY)
    private List<VnTitles> titles;

    // ... other fields
}
```

### On the VnTitles entity (the "many" side):

```java
@Entity
@Table(name = "vn_titles")
@IdClass(VnTitlesId.class)
public class VnTitles {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", insertable = false, updatable = false)
    private Vn vn;

    @Id
    @Column(name = "lang")
    private Language language;

    // ... other fields
}
```

### How JPA handles this — no manual SQL JOIN needed

When you do `vnRepository.findById("v17")`, JPA knows:
- `Vn.titles` is mapped by the `vn` field in `VnTitles`
- It generates: `SELECT * FROM vn_titles WHERE id = 'v17'` when you access `vn.getTitles()`

**LAZY** means titles are NOT loaded until you call `getTitles()`. This avoids loading titles for list endpoints where you don't need them.

### `insertable = false, updatable = false`

The `id` column in `vn_titles` is both:
- Part of the composite primary key (`@Id`)
- The foreign key to `vn` (`@JoinColumn`)

JPA doesn't allow two mappings to control the same column. Adding `insertable = false, updatable = false` tells JPA: "this mapping is read-only — the `@Id` mapping owns the column."

---

## 3. Field Selection — Let Frontend Choose What to Get

### The Pattern: Query Parameters as Field Selectors

```
GET /api/vn/v17?fields=image,titles,cRating
GET /api/vn?page=0&size=20&fields=image,olang
```

The frontend sends a `fields` parameter listing what it wants. The backend returns only those fields (others are `null` or omitted).

### How to Implement

**Option A: Jackson `@JsonInclude` + manual field filtering**

Use `@JsonInclude(JsonInclude.Include.NON_NULL)` on the DTO so null fields are omitted from JSON. Then in the mapper/service, only populate the requested fields.

```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VnDTO {
    private String image;
    private List<VnTitlesDTO> titles;  // null if not requested
    private Short cRating;
    // ...
}
```

**Option B: Spring GraphQL** (if field selection is a core feature)

GraphQL was designed exactly for this — the client specifies which fields it wants in the query. But it's a bigger architectural change.

**Option C: Projections (simple, JPA-native)**

Define interfaces for different views:

```java
public interface VnSummary {
    String getId();
    String getImage();
    Short getCRating();
}

public interface VnDetail {
    String getId();
    String getImage();
    List<VnTitlesDTO> getTitles();
    // all fields...
}
```

### Recommendation

For now: **Option A** — add `titles` to `VnDTO`, use `@JsonInclude(NON_NULL)`, and accept a `fields` query param. It's simple, works with your existing setup, and doesn't require GraphQL overhead.

---

## 4. The N+1 Problem

When loading a list of VNs with titles using LAZY fetch:

```
SELECT * FROM vn LIMIT 20;          -- 1 query
SELECT * FROM vn_titles WHERE id = 'v1';  -- query 2
SELECT * FROM vn_titles WHERE id = 'v2';  -- query 3
...                                       -- 20 MORE queries!
```

That's 21 queries for 20 VNs. This is the **N+1 problem**.

### Fix: `@EntityGraph` or `JOIN FETCH`

```java
// Option 1: EntityGraph on repository method
@EntityGraph(attributePaths = {"titles"})
Page<Vn> findAll(Pageable pageable);

// Option 2: JPQL JOIN FETCH
@Query("SELECT v FROM Vn v JOIN FETCH v.titles WHERE v.id = :id")
Vn findByIdWithTitles(@Param("id") String id);
```

Both tell JPA: "load titles in the same query using a JOIN" — one query instead of N+1.

**Only use JOIN FETCH when you actually need titles.** For list endpoints that don't need titles, the regular `findAll` with LAZY fetch is more efficient.

---

## Summary

| Concept | What it does |
|---|---|
| `@IdClass` | Defines a composite primary key (id + lang) |
| `@OneToMany` / `@ManyToOne` | Links Vn to its titles — JPA handles the JOIN |
| `FetchType.LAZY` | Titles loaded only when accessed, not upfront |
| `@EntityGraph` / `JOIN FETCH` | Solves N+1 by loading titles in one query |
| `fields` query param | Frontend picks which fields to receive |
| `@JsonInclude(NON_NULL)` | Omits null fields from JSON response |
