import { checkbox } from "@inquirer/prompts";
import type { ZodTypeAny } from "zod";
import type { PromptHandler } from "./types";

export const checkboxHandler: PromptHandler = {
	canHandle: (fieldSchema: ZodTypeAny) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		const typeName = def.typeName || def.type;
		if (typeName !== "ZodArray" && typeName !== "array") return false;

		const element = def.element || (typeof def.type === "object" ? def.type : undefined);
		const elementTypeName = element?._def?.typeName || element?._def?.type;
		return elementTypeName === "ZodEnum" || elementTypeName === "enum";
	},

	prompt: async (fieldSchema: ZodTypeAny, _fieldName: string, message: string) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		const element = def.element || (typeof def.type === "object" ? def.type : undefined);
		const elementDef = element._def;
		const enumValues =
			elementDef.values ||
			(elementDef.entries ? Object.keys(elementDef.entries) : element.options) ||
			[];
		return await checkbox({
			message,
			choices: enumValues.map((v: string) => ({ name: v, value: v })),
		});
	},
};
