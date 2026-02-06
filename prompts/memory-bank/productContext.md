# Product Context: zod-inquirer

## Why This Exists

### Problem Statement
Developers using Zod for schema validation often need to collect user input via CLI prompts. This requires:
1. Writing separate prompt logic alongside schema definitions
2. Manually validating prompt responses against schemas
3. Implementing retry logic for invalid inputs
4. Maintaining consistency between schema and prompts

This creates duplication, maintenance burden, and potential for schema/prompt mismatches.

### Solution
zod-inquirer eliminates duplication by automatically generating validated prompts directly from Zod schemas. Define your schema once, get validated prompts automatically.

## How It Should Work

### User Experience

**Before (without zod-inquirer):**
```typescript
const schema = z.object({ name: z.string(), size: z.enum(['S', 'M', 'L']) });

// Manually create prompts
const name = await input({ message: 'Name?' });
const size = await select({ message: 'Size?', choices: [...] });

// Manually validate
const result = schema.parse({ name, size });
```

**After (with zod-inquirer):**
```typescript
const schema = z.object({ name: z.string(), size: z.enum(['S', 'M', 'L']) });
const result = await zodPrompter(schema);
// Automatically prompts and validates!
```

### Key Behaviors

1. **Automatic Prompt Type Selection**
   - Inspects Zod schema field types
   - Chooses appropriate Inquirer prompt type
   - Generates user-friendly messages from field names

2. **Inline Validation**
   - Validates each input immediately using Zod
   - Shows clear error messages on validation failure
   - Allows retry with configurable max attempts

3. **Graceful Error Handling**
   - User-friendly validation error messages
   - Retry counter with hints
   - Throws after max retries exceeded

4. **Flexible Configuration**
   - Optional `maxRetries` (default: 3)
   - Optional `hint` message for retry guidance

## User Goals

### Primary Goals
- Reduce boilerplate when building CLI tools
- Ensure prompt responses always match schema
- Get type-safe results automatically
- Maintain single source of truth (the schema)

### Secondary Goals
- Easy to learn and integrate
- Works with existing Zod schemas
- Minimal configuration required
- Clear error messages for debugging
