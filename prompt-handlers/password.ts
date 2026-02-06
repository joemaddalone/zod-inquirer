import { password } from "@inquirer/prompts";
import type { ZodTypeAny } from "zod";
import type { PromptHandler } from "./types";

const PASSWORD_FIELD_PATTERNS = [
	"password",
	"secret",
	"token",
	"apikey",
	"apiKey",
	"api_key",
];

export const passwordHandler: PromptHandler = {
	canHandle: (fieldSchema: ZodTypeAny, fieldName: string) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		const typeName = def.typeName || def.type;
		const isString = typeName === "ZodString" || typeName === "string";

		if (!isString) return false;

		const lowerFieldName = fieldName.toLowerCase();
		return PASSWORD_FIELD_PATTERNS.some((pattern) =>
			lowerFieldName.includes(pattern.toLowerCase()),
		);
	},

	prompt: async (fieldSchema: ZodTypeAny, _fieldName: string, message: string) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const description = (fieldSchema as any).description;
		const finalMessage = description || message;
		return await password({ message: finalMessage });
	},
};
