import { input } from "@inquirer/prompts";
import type { ZodTypeAny } from "zod";
import type { PromptHandler } from "./types";

export const inputHandler: PromptHandler = {
	canHandle: (fieldSchema: ZodTypeAny) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		const typeName = def.typeName || def.type;
		
		if (typeName === "ZodString" || typeName === "string") {
			return true;
		}
		
		if (typeName === "ZodDefault" || typeName === "default") {
			const innerType = def.innerType?._def?.typeName || def.innerType?._def?.type;
			return innerType === "ZodString" || innerType === "string";
		}
		
		return false;
	},

	prompt: async (
		fieldSchema: ZodTypeAny,
		_fieldName: string,
		message: string,
	) => {
		// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
		const def = (fieldSchema as any)._def;
		const typeName = def.typeName || def.type;
		
		let description: string | undefined;
		let defaultValue: string | undefined;
		
		if (typeName === "ZodDefault" || typeName === "default") {
			const innerSchema = def.innerType;
			description = innerSchema?.description;
			defaultValue = def.defaultValue;
		} else {
			// biome-ignore lint/suspicious/noExplicitAny: support multiple zod versions
			description = (fieldSchema as any).description;
		}
		
		const finalMessage = description || message;
		return await input({ message: finalMessage, default: defaultValue });
	},
};
