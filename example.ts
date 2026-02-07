import { z } from "zod";
import { zodPrompter } from "./index";

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
  deliveryWindow: z
    .string() // deliveryWindow produces the same UI as size and crust, but with dynamic choices
    .meta({ description: "Select delivery window" }),
  allergens: z
    .array(z.enum(["gluten", "dairy", "nuts", "soy", "eggs"]))
    .meta({ description: "Select any allergens" }),
  toppings: z
    .array(z.string()) // toppings produces the same UI as allergens, but with dynamic choices
    .min(1, { message: "You must select at least one topping." })
    .max(3, { message: "You can select up to 3 toppings." })
    .meta({ description: "Select up to 3 toppings" }),
  acceptTerms: z.boolean().meta({ description: "Accept terms and conditions" }),
  password: z.string().min(8).meta({ description: "Enter your password" }),
});

// When choices come from an external source, pass them into zodPrompter
// instead of hardcoding them in the schema. Example below shows static
// choices passed via options.  These could come from an API or config file.

const pizza = await zodPrompter(PizzaSchema, {
  choices: {
    deliveryWindow: ["ASAP", "In 30 minutes", "In 1 hour", "Sometime later"],
    toppings: [
      "pepperoni",
      "mushrooms",
      "onions",
      "sausage",
      "bacon",
      "extra cheese",
    ],
  },
});
console.log(pizza);
