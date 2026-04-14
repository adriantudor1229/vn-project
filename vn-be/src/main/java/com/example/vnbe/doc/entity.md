# JPA / Hibernate Entity Annotations

## `@Entity`
Marks a class as a JPA entity — a Java object that maps to a database table. Hibernate will manage this class and track its lifecycle (persist, merge, remove, detach). Without this annotation, JPA ignores the class entirely.

## `@Table(name = "table_name")`
Specifies which database table the entity maps to. If omitted, JPA uses the class name as the table name. Use this when your table name differs from the class name (e.g., `@Table(name = "vn")` for a class called `VisualNovel`).

## `@Id`
Marks a field as the primary key of the entity. Every entity must have exactly one `@Id`. This is how JPA uniquely identifies each row in the table.

## `@GeneratedValue(strategy = GenerationType.XXX)`
Tells JPA how the primary key value is generated. Common strategies:
- `IDENTITY` — database auto-increment column
- `SEQUENCE` — uses a database sequence (preferred for PostgreSQL)
- `AUTO` — lets the JPA provider choose
- `TABLE` — uses a separate table to simulate sequences

## `@Column(name = "column_name")`
Maps a field to a specific database column. Useful when the field name in Java differs from the column name in the database. Optional attributes:
- `nullable = false` — column cannot be null
- `length = 255` — max length for strings
- `unique = true` — column must have unique values
- `columnDefinition = "TEXT"` — raw SQL type override

If omitted, JPA maps the field to a column with the same name as the field.

## `@Enumerated(EnumType.STRING)`
Maps a Java enum to a database column. Two modes:
- `EnumType.STRING` — stores the enum name as text (recommended, readable, safe against reordering)
- `EnumType.ORDINAL` — stores the enum position as an integer (fragile, breaks if enum order changes)

## `@Transient`
Excludes a field from persistence. JPA will not map this field to any database column. Use for computed values or temporary data that should only exist in memory.

## `@Lob`
Marks a field as a Large Object. Used for storing large text (`CLOB`) or binary data (`BLOB`) in the database.

## `@Temporal(TemporalType.TIMESTAMP)`
Specifies the precision of a `java.util.Date` or `java.util.Calendar` field:
- `DATE` — only the date (yyyy-MM-dd)
- `TIME` — only the time (HH:mm:ss)
- `TIMESTAMP` — date and time

Note: Not needed for `java.time` types like `LocalDate`, `LocalDateTime` — JPA 2.2+ handles them natively.

## `@CreationTimestamp`
Hibernate-specific. Automatically sets the field value to the current timestamp when the entity is first persisted. No manual setting needed.

## `@UpdateTimestamp`
Hibernate-specific. Automatically updates the field value to the current timestamp every time the entity is updated.

---

# Relationship Annotations

## `@OneToOne`
One entity is associated with exactly one instance of another entity. Example: a User has one Profile.

## `@OneToMany(mappedBy = "fieldName")`
One entity is associated with many instances of another. The `mappedBy` attribute points to the field in the child entity that owns the relationship. Example: one Author has many Books.

## `@ManyToOne`
Many instances of this entity are associated with one instance of another. This is the owning side of a `@OneToMany` relationship. Typically paired with `@JoinColumn`.

## `@ManyToMany`
Many instances of one entity are associated with many instances of another. Requires a join table. Use `@JoinTable` to configure the join table name and columns.

## `@JoinColumn(name = "fk_column")`
Specifies the foreign key column used for a relationship. Placed on the owning side of the relationship (usually `@ManyToOne` or `@OneToOne`).

---

# Fetch & Cascade

## `fetch = FetchType.LAZY`
Data is loaded only when you access the relationship field. Default for `@OneToMany` and `@ManyToMany`. Saves memory and query time when you don't always need related data.

## `fetch = FetchType.EAGER`
Data is loaded immediately with the parent entity. Default for `@ManyToOne` and `@OneToOne`. Can cause performance issues if overused (N+1 problem).

## `cascade = CascadeType.ALL`
Operations on the parent entity propagate to related entities. Types:
- `PERSIST` — saving parent also saves children
- `MERGE` — updating parent also updates children
- `REMOVE` — deleting parent also deletes children
- `REFRESH` — refreshing parent also refreshes children
- `DETACH` — detaching parent also detaches children
- `ALL` — all of the above

---

# Validation Annotations (Jakarta Validation)

## `@NotNull`
Field must not be null. Validated before persistence.

## `@NotBlank`
String must not be null, empty, or whitespace-only.

## `@Size(min = X, max = Y)`
Constrains the size of a string, collection, or array.

## `@Min(value)` / `@Max(value)`
Numeric field must be at least / at most the specified value.

## `@Email`
String must be a valid email format.

## `@Pattern(regexp = "...")`
String must match the given regular expression.
