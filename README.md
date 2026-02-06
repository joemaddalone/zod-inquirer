# zod-inquirer (WIP)

A TypeScript library that automatically generates validated CLI prompts from Zod schemas.

## Installation

```bash
npm install zod-inquirer
```

## Usage

Define your schema once, get validated prompts automatically:

```typescript
import { z } from "zod";
import { zodPrompter } from "zod-inquirer";

const PizzaSchema = z.object({
  name: z.string(),
  size: z.enum(["small", "medium", "large"]),
  crust: z.enum(["thin", "thick", "stuffed"]),
  toppings: z
    .array(
      z.enum([
        "pepperoni",
        "mushrooms",
        "onions",
        "sausage",
        "bacon",
        "extra cheese",
      ]),
    )
    .min(1, { message: "You must select at least one topping." })
    .max(3, { message: "You can select up to 3 toppings." }),
});

const pizza = await zodPrompter(PizzaSchema);
console.log(pizza);
```

This will automatically prompt the user with:

- A text input for `name`
- A select dropdown for `size`
- A select dropdown for `crust`
- A checkbox list for `toppings`

All inputs are validated against your Zod schema with automatic retry on validation failure.

## Options

```typescript
await zodPrompter(schema, {
  maxRetries: 3, // Maximum retry attempts for invalid input (default: 3)
  hint: "press Ctrl+C to abort", // Hint message shown on validation error
});
```

## Supported Types

- `z.string()` - Text input
- `z.enum()` - Select dropdown
- `z.array(z.enum())` - Checkbox multi-select

## License

MIT
