# Repository

## What It Is

A Repository is an interface that handles all database operations for an entity. Spring Data JPA provides the implementation automatically — you just define the interface.

## How It Works

You extend `JpaRepository<EntityType, IdType>` and Spring generates the implementation at runtime. No class needed, no SQL needed for basic operations.

```java
@Repository
public interface VnRepository extends JpaRepository<Vn, String> {
}
```

This alone gives you:

| Method | What It Does |
|---|---|
| `findAll()` | Returns all rows |
| `findById(id)` | Returns one row by primary key (wrapped in `Optional`) |
| `save(entity)` | Inserts or updates a row |
| `deleteById(id)` | Deletes a row by primary key |
| `count()` | Returns total row count |
| `existsById(id)` | Checks if a row exists |

## Custom Queries

### By method name — Spring parses the name and builds the query:

```java
List<Vn> findByOlang(Language olang);
List<Vn> findByDevstatus(Short devstatus);
Optional<Vn> findByAlias(String alias);
```

### By `@Query` — for anything more complex:

```java
@Query("SELECT v FROM Vn v WHERE v.cRating > :minRating")
List<Vn> findByMinRating(@Param("minRating") Short minRating);
```

## Pagination

Built-in. Pass a `Pageable` parameter:

```java
Page<Vn> findByOlang(Language olang, Pageable pageable);
```

Call it with:
```java
vnRepository.findByOlang(Language.JA, PageRequest.of(0, 20));
```

Returns page 0 with 20 results, plus total count metadata.

## Why `String` as the ID type

The `vn` table uses `text` as its primary key (`id` column), so the repository generic type is `JpaRepository<Vn, String>`.
