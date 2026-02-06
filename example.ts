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
		.max(3, { message: "You can select up to 3 toppings." })
		.meta({ description: "Select up to 3 toppings" }),
	acceptTerms: z.boolean().meta({ description: "Accept terms and conditions" }),
	password: z.string().min(8).meta({ description: "Enter your password" }),
});

const pizza = await zodPrompter(PizzaSchema);
console.log(pizza);
