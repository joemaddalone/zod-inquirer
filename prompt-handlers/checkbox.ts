import { checkbox } from "@inquirer/prompts";
import type { ZodTypeAny } from "zod";
import type { PromptHandler } from "./types";

export const checkboxHandler: PromptHandler = {
	canHandle: (fieldSchema: ZodTypeAny) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		const typeName = def.typeName || def.type;
		if (typeName !== "ZodArray" && typeName !== "array") return false;

		const element =
			def.element || (typeof def.type === "object" ? def.type : undefined);
		const elementTypeName = element?._def?.typeName || element?._def?.type;
		// Support z.array(z.enum(...)) and z.array(z.string()) for custom choices
		return (
			elementTypeName === "ZodEnum" ||
			elementTypeName === "enum" ||
			elementTypeName === "ZodString" ||
			elementTypeName === "string"
		);
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
		const element =
			def.element || (typeof def.type === "object" ? def.type : undefined);
		const elementDef = element._def;

		const finalMessage = description || message;

		let finalChoices: { name: string; value: string }[] = [];

		if (choices?.length) {
			finalChoices = choices.map((c: string | { name: string; value: string }) =>
				typeof c === "string" ? { name: c, value: c } : c,
			);
		} else {
			const enumValues =
				elementDef.values ||
				(elementDef.entries ? Object.keys(elementDef.entries) : element.options) ||
				[];
			finalChoices = enumValues.map((v: string) => ({ name: v, value: v }));
		}

		return await checkbox({
			message: finalMessage,
			choices: finalChoices,
		});
	},
};
