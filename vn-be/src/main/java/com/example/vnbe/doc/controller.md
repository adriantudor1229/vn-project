# Controller

## What It Is

A Controller is the entry point for HTTP requests. It receives requests, delegates work to the Service layer, and returns responses. No business logic belongs here.

```
HTTP Request → Controller → Service → Repository → Database
HTTP Response ← Controller ← Service ← Repository ← Database
```

## Key Annotations

### `@RestController`
Combines `@Controller` + `@ResponseBody`. Every method return value is automatically serialized to JSON (no need for `@ResponseBody` on each method).

### `@RequestMapping("/api/vn")`
Sets the base URL path for all endpoints in this controller. Every method path is relative to this.

### HTTP Method Annotations

| Annotation | HTTP Method | Purpose |
|---|---|---|
| `@GetMapping` | GET | Read data |
| `@PostMapping` | POST | Create data |
| `@PutMapping` | PUT | Update data (full replace) |
| `@PatchMapping` | PATCH | Update data (partial) |
| `@DeleteMapping` | DELETE | Remove data |

### `@PathVariable`
Extracts a value from the URL path:
```java
@GetMapping("/{id}")
public VnDTO findById(@PathVariable String id)
// GET /api/vn/v17 → id = "v17"
```

### `@RequestBody`
Deserializes the JSON request body into a Java object:
```java
@PostMapping
public VnDTO create(@RequestBody VnDTO dto)
```

### `@RequestParam`
Extracts query parameters from the URL:
```java
@GetMapping
public List<VnDTO> search(@RequestParam String olang)
// GET /api/vn?olang=ja → olang = "ja"
```

## Example

```java
@RestController
@RequestMapping("/api/vn")
@RequiredArgsConstructor
public class VnController {

    private final VnService vnService;

    @GetMapping
    public List<VnDTO> findAll() {
        return vnService.findAll();
    }

    @GetMapping("/{id}")
    public VnDTO findById(@PathVariable String id) {
        return vnService.findById(id);
    }
}
```

## Why It Should Be Thin

The controller's only job:
1. Receive the request
2. Pass it to the service
3. Return the result

If you see `if/else` logic, data transformation, or multiple repository calls in a controller — it belongs in the service instead. A thin controller is easy to test, easy to read, and easy to swap (e.g., replace REST with GraphQL without rewriting business logic).

## Response Status

Spring sets `200 OK` by default. Override with `@ResponseStatus` or return `ResponseEntity`:

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)  // returns 201
public VnDTO create(@RequestBody VnDTO dto) {
    return vnService.create(dto);
}

// or with ResponseEntity for more control
@GetMapping("/{id}")
public ResponseEntity<VnDTO> findById(@PathVariable String id) {
    return ResponseEntity.ok(vnService.findById(id));
}
```
