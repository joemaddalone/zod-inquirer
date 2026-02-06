import { z } from "zod";
import { zodPrompter } from "zod-inquirer";

const PizzaSchema = z.object({
	name: z.string(),
	email: z.email(),
	age: z.number().int().positive(),
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
	acceptTerms: z.boolean(),
	password: z.string().min(8),
});

const pizza = await zodPrompter(PizzaSchema);
console.log(pizza);
