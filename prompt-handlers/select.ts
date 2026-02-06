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
	) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const description = (fieldSchema as any).description;
		const enumValues =
			def.values ||
			// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
			(def.entries ? Object.keys(def.entries) : (fieldSchema as any).options) ||
			[];
		const finalMessage = description || message;
		return await select({
			message: finalMessage,
			choices: enumValues.map((v: string) => ({ name: v, value: v })),
		});
	},
};
