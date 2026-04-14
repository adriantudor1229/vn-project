# Lombok Annotations Reference

## Core Annotations

### `@Getter` / `@Setter`
Generates getter/setter methods for fields. Can be applied at class level (all fields) or field level (specific fields).

### `@ToString`
Generates a `toString()` method including all fields. Use `@ToString.Exclude` to skip fields.

### `@EqualsAndHashCode`
Generates `equals()` and `hashCode()` methods based on fields. Use `@EqualsAndHashCode.Exclude` to skip fields.

### `@NoArgsConstructor`
Generates a no-argument constructor.

### `@AllArgsConstructor`
Generates a constructor with one parameter for each field in the class.

### `@RequiredArgsConstructor`
Generates a constructor for all `final` fields and fields marked `@NonNull`.

### `@Data`
Shortcut that combines: `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`, and `@RequiredArgsConstructor`.

### `@Value`
Immutable version of `@Data`. Makes the class `final`, all fields `private final`, generates getters (no setters), `toString`, `equals`, `hashCode`, and `@AllArgsConstructor`.

### `@Builder`
Implements the builder pattern. Allows creating objects like: `MyClass.builder().name("x").age(5).build()`.

### `@SuperBuilder`
Like `@Builder` but supports inheritance — works with parent/child class hierarchies.

## Null Handling

### `@NonNull`
Generates a null-check for a field or parameter. Throws `NullPointerException` if the value is null.

## Logging

### `@Slf4j`
Creates a `private static final Logger log` field using SLF4J.

### `@Log`
Creates a `private static final Logger log` field using `java.util.logging`.

### `@Log4j2`
Creates a logger using Log4j 2.

## Utility

### `@Cleanup`
Ensures a resource (like a stream) is closed at the end of the scope. Calls `.close()` automatically.

### `@SneakyThrows`
Allows throwing checked exceptions without declaring them in `throws`. Use sparingly — hides checked exceptions.

### `@Synchronized`
Generates a synchronized block using a private lock object instead of `synchronized` on the method itself.

### `@With`
Generates a `withFieldName(value)` method that returns a clone of the object with that one field changed (immutable update).

### `@Accessors`
Configures getter/setter style:
- `fluent = true` — getters/setters named like the field (`name()` instead of `getName()`)
- `chain = true` — setters return `this` for chaining

### `@Delegate`
Generates delegate methods — forwards calls to an inner field's methods.

### `@FieldDefaults`
Sets default access level and `final` modifier for all fields. Example: `@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)`.

## JPA / Persistence Related

### `@Builder.Default`
Sets a default value for a field when using `@Builder`. Without this, builder ignores field initializers.

## Experimental

### `@UtilityClass`
Makes a class `final`, adds a private constructor, and makes all members `static`. For utility/helper classes.

### `@ExtensionMethod`
Adds extension methods to existing classes (like C# extension methods).

### `@FieldNameConstants`
Generates an inner class with `String` constants for each field name — useful for type-safe queries.
