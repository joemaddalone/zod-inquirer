# System Patterns: zod-inquirer

## Architecture Overview

### Core Design
Single-function API with minimal surface area:
- `zodPrompter(schema, options)` - main entry point
- Returns validated data matching schema type
- Throws on validation failure after max retries

### Key Components

#### 1. Schema Introspection
```typescript
const schemaShape = schema.shape;
const fields = Object.keys(schemaShape);
```
- Extracts field definitions from Zod object schema
- Iterates through fields sequentially
- Accesses internal `_def` structure for type information

#### 2. Type-to-Prompt Mapping
```typescript
if (def.type === "enum") → select()
if (def.type === "array" && element is enum) → checkbox()
else → input()
```
- Inspects `_def.type` to determine Zod type
- Maps to appropriate Inquirer prompt function
- Handles nested types (array of enum)

#### 3. Validation Loop
```typescript
while (true) {
  value = await prompt();
  result = fieldSchema.safeParse(value);
  if (result.success) break;
  attempts++;
  if (attempts >= maxRetries) throw;
}
```
- Uses `safeParse()` for non-throwing validation
- Reprompts on validation failure
- Tracks attempts and enforces max retries

## Design Patterns

### Pattern: Schema-Driven Generation
- Schema is single source of truth
- All prompts derived from schema structure
- No manual prompt configuration needed

### Pattern: Progressive Enhancement
- Basic types get basic prompts (input)
- Special types get enhanced prompts (select, checkbox)
- Extensible for future type support

### Pattern: Fail-Fast with Retries
- Immediate validation feedback
- Limited retry attempts prevent infinite loops
- Clear error messages guide user

## Technical Decisions

### Why Sequential Prompting?
- Simpler mental model for users
- Easier to implement validation per field
- Matches typical CLI form flow

### Why `_def` Introspection?
- Zod doesn't expose public type inspection API
- `_def` provides necessary type information
- Stable enough for production use

### Why `safeParse()`?
- Non-throwing validation allows retry logic
- Access to detailed error messages
- Cleaner control flow than try/catch

### Why Limited Prompt Types?
- Covers 80% of CLI use cases
- Keeps implementation simple
- Easy to understand and maintain

## Module Structure

```
index.ts
├── zodPrompter() - main function
├── SchemaPrompterOptions - config interface
└── Type introspection logic
```

Single file implementation:
- No internal modules needed
- All logic co-located
- Easy to understand flow

## Extension Points

Future enhancements could add:
- Custom prompt type mappings
- Field-level configuration
- Conditional field logic
- Custom validation messages
- More Zod type support (number, boolean, date, etc.)
