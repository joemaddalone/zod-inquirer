# zod-inquirer (WIP)

A TypeScript library that automatically generates validated CLI prompts from Zod schemas.

## Installation

```bash
npm install zod-inquirer
```

## Usage

Define your schema once, get validated prompts automatically (example uses `choices` passed to `zodPrompter`):

```typescript
import { z } from "zod";
import { zodPrompter } from "zod-inquirer";

const PizzaSchema = z.object({
  name: z.string().describe("Enter your name"), // Zod 3 style
  email: z.email().meta({ description: "Enter your email" }), // Zod 4 style
  age: z.number().int().positive(), // will use default description
  size: z
    .enum(["small", "medium", "large"])
    .meta({ description: "Select your size" }),
  crust: z
    .enum(["thin", "thick", "stuffed"])
    .meta({ description: "Select your crust" }),
  deliveryWindow: z.string().meta({ description: "Select delivery window" }),
  toppings: z
    .array(z.string())
    .min(1, { message: "You must select at least one topping." })
    .max(3, { message: "You can select up to 3 toppings." })
    .meta({ description: "Select up to 3 toppings" }),
  acceptTerms: z.boolean().meta({ description: "Accept terms and conditions" }),
  password: z.string().min(8).meta({ description: "Enter your password" }),
});

const pizza = await zodPrompter(PizzaSchema, {
  choices: {
    deliveryWindow: ["ASAP", "In 30 minutes", "In 1 hour", "Sometime later"],
    toppings: ["pepperoni", "mushrooms", "onions", "sausage", "bacon", "extra cheese"],
  },
});
console.log(pizza);
```

This will automatically prompt the user with:

- A text input for `name`
- A text input for `email`
- A number input for `age`
- A select dropdown for `size`
- A select dropdown for `crust`
- A select dropdown for `deliveryWindow`
- A checkbox list for `toppings`
- A confirm checkbox for `acceptTerms`
- A password input for `password`

All inputs are validated against your Zod schema with automatic retry on validation failure.

## Options

```typescript
await zodPrompter(schema, {
  maxRetries: 3, // Maximum retry attempts for invalid input (default: 3)
  hint: "press Ctrl+C to abort", // Hint message shown on validation error
  // Provide static choices for specific fields (strings or { name, value } objects)
  choices: {
    deliveryWindow: ["ASAP", "In 30 minutes", "In 1 hour", "Sometime later"],
    toppings: ["pepperoni", "mushrooms", "onions"],
  },
});
```

Notes:

- The `choices` object is a mapping from schema field name to an array of choices.
- If choices are provided for a field, the prompter will use them instead of deriving options from `z.enum`.
- For array fields (e.g. `z.array(z.string())`) the prompter will use a checkbox multi-select; for single-value fields (e.g. `z.string()`) it will use a select.
- Choices can be simple strings or objects with `{ name, value }` to control display text vs stored value.
- Ensure the keys in `choices` exactly match your schema field names (case-sensitive).

## Supported Types

- `z.string()` - Text input, masked based on name: `password`, `secret`, `token`, `apikey`, `apiKey`, `api_key`
- `z.enum()` - Select dropdown
- `z.array(z.enum())` - Checkbox multi-select
- `z.boolean()` - Checkbox
- `z.number()` - Number input
- `z.email()` - Email input

## License

MIT
