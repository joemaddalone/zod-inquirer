import { select } from "@inquirer/prompts";
import type { ZodTypeAny } from "zod";
import type { PromptHandler } from "./types";

export const selectHandler: PromptHandler = {
	canHandle: (fieldSchema: ZodTypeAny) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		const typeName = def.typeName || def.type;
		return typeName === "ZodEnum" || typeName === "enum";
	},

	prompt: async (
		fieldSchema: ZodTypeAny,
		_fieldName: string,
		message: string,
		choices?: Array<string | { name: string; value: string }>,
	) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const description = (fieldSchema as any).description;
		const finalMessage = description || message;

		let finalChoices: { name: string; value: string }[] = [];
		if (choices?.length) {
			finalChoices = choices.map((c: string | { name: string; value: string }) =>
				typeof c === "string" ? { name: c, value: c } : c,
			);
		} else {
			const enumValues =
				def.values ||
				// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
				(def.entries ? Object.keys(def.entries) : (fieldSchema as any).options) ||
				[];
			finalChoices = enumValues.map((v: string) => ({ name: v, value: v }));
		}

		return await select({
			message: finalMessage,
			choices: finalChoices,
		});
	},
};
