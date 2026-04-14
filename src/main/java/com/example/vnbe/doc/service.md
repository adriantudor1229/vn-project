# Service

## What It Is

A Service is the layer between the Controller (handles HTTP) and the Repository (handles database). It contains the business logic — the rules and decisions your application makes.

## Why It Exists

Without a service layer:
```
Controller → Repository (controller has business logic mixed with HTTP logic)
```

With a service layer:
```
Controller → Service → Repository
```

**Separation of concerns:**
- **Controller** — receives the request, returns the response. That's it.
- **Service** — decides what to do with the data (validate, transform, combine, apply rules)
- **Repository** — reads/writes to the database. That's it.

This means you can reuse the same business logic from different places (another controller, a scheduled task, a CLI command) without duplicating code.

## How It Works

### The Interface

Defines what operations are available:

```java
public interface VnService {
    List<VnDTO> findAll();
    VnDTO findById(String id);
}
```

### The Implementation

Contains the actual logic, annotated with `@Service`:

```java
@Service
@RequiredArgsConstructor
public class VnServiceImpl implements VnService {

    private final VnRepository vnRepository;
    private final VnMapper vnMapper;

    @Override
    public List<VnDTO> findAll() {
        return vnRepository.findAll()
                .stream()
                .map(vnMapper::toDto)
                .toList();
    }

    @Override
    public VnDTO findById(String id) {
        Vn vn = vnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VN not found: " + id));
        return vnMapper.toDto(vn);
    }
}
```

## Key Annotations

### `@Service`
Marks the class as a Spring-managed bean. Spring creates one instance and injects it wherever needed. It's functionally the same as `@Component` but signals intent — this is a service.

### `@RequiredArgsConstructor` (Lombok)
Generates a constructor for all `final` fields. Spring uses this constructor to inject the dependencies (`VnRepository`, `VnMapper`). This is constructor injection — the recommended way in Spring.

### `@Transactional`
Put on methods that should run inside a database transaction. If anything fails, all changes roll back. Use on methods that write to the database or call multiple repository methods that should succeed or fail together.

```java
@Transactional
public void deleteById(String id) {
    // if any step fails, nothing is committed
    vnRepository.deleteById(id);
}
```

Read-only methods can use `@Transactional(readOnly = true)` for a performance hint to Hibernate.

## Why Interface + Implementation

- **Testability** — you can mock the interface in tests without touching the real implementation
- **Swappability** — you can swap implementations without changing the code that depends on it
- **Clarity** — the interface shows what the service can do at a glance

For small projects, some teams skip the interface and just use the class directly. Both approaches work.
