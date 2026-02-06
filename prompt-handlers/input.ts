import { input } from "@inquirer/prompts";
import type { ZodTypeAny } from "zod";
import type { PromptHandler } from "./types";

export const inputHandler: PromptHandler = {
	canHandle: (fieldSchema: ZodTypeAny) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		const typeName = def.typeName || def.type;
		return typeName === "ZodString" || typeName === "string";
	},

	prompt: async (
		fieldSchema: ZodTypeAny,
		_fieldName: string,
		message: string,
	) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const description = (fieldSchema as any).description;
		const finalMessage = description || message;
		return await input({ message: finalMessage });
	},
};
