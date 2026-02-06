# Tech Context: zod-inquirer

## Technology Stack

### Core Dependencies
- **Zod** (v3.22.4): Schema validation library
- **@inquirer/prompts** (v8.2.0): CLI prompt library
- **TypeScript** (v5.9.2): Type system and compiler

### Development Dependencies
- **Vitest** (v3.2.4): Test runner and framework
- **@vitest/coverage-v8**: Code coverage reporting
- **tsup** (v8.5.0): TypeScript bundler
- **@types/node**: Node.js type definitions

## Build Configuration

### Module Formats
Supports multiple output formats via tsup:
- **ESM**: `dist/esm/index.js` (import)
- **CJS**: `dist/index.cjs` (require)
- **Default**: `dist/index.js` (Node.js)
- **IIFE**: `dist/iife/index.js` (browser)

### TypeScript Config
```json
{
  "target": "ESNext",
  "module": "ESNext",
  "moduleResolution": "bundler",
  "strict": true
}
```
- Modern ES features
- Strict type checking enabled
- Bundler-friendly module resolution

### Build Process
```bash
npm run build    # tsup build
npm run dev      # tsup --watch
npm run clean    # rm -rf dist
```

Post-build: Copies `dist/index.js` to `dist/index.cjs` for CJS compatibility

## Testing Setup

### Test Framework: Vitest
- Fast, Vite-powered test runner
- Jest-compatible API
- Built-in mocking support

### Test Commands
```bash
npm test           # Run tests once
npm run test:watch # Watch mode
npm run coverage   # Generate coverage report
```

### Mocking Strategy
Uses `vi.mock()` to mock Inquirer prompts:
```typescript
vi.mock("@inquirer/prompts", () => ({
  input: vi.fn(),
  select: vi.fn(),
  checkbox: vi.fn(),
}));
```

This allows testing prompt logic without actual user interaction.

## Development Workflow

### Local Development
1. `npm install` - Install dependencies
2. `npm run dev` - Start watch mode
3. `npm test` - Run tests
4. `npm run build` - Build for production

### Quality Gates
All changes must pass:
1. **Tests**: `npm test` (all tests pass)
2. **Linting**: `npm run lint` (zero warnings/errors)
3. **Build**: `npm run build` (successful compilation)

## Technical Constraints

### Runtime Environment
- Node.js (ESM and CJS support)
- Browser (via IIFE bundle)
- Requires terminal for Inquirer prompts

### Type Safety
- Full TypeScript support
- Exported types for public API
- Type inference from Zod schemas

### Bundle Size
- Minimal implementation (single file)
- No unnecessary dependencies
- Tree-shakeable exports

## Code Quality Tools

### Biome (biome.json)
- Linting and formatting
- Configured for TypeScript
- Enforces code style consistency

### Package Exports
```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/esm/index.js",
    "require": "./dist/index.cjs",
    "default": "./dist/index.js"
  }
}
```
Ensures correct module resolution across environments.

## Repository
- **GitHub**: github.com/joemaddalone/zod-inquirer
- **License**: MIT
- **Author**: Joe Maddalone
