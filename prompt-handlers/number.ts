import { number } from "@inquirer/prompts";
import type { ZodTypeAny } from "zod";
import type { PromptHandler } from "./types";

export const numberHandler: PromptHandler = {
	canHandle: (fieldSchema: ZodTypeAny) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		const typeName = def.typeName || def.type;
		return typeName === "ZodNumber" || typeName === "number";
	},

	prompt: async (
		_fieldSchema: ZodTypeAny,
		_fieldName: string,
		message: string,
	) => {
		return await number({ message });
	},
};
