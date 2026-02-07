import type { ZodTypeAny } from "zod";

export type PromptChoice = string | { name: string; value: string };

export interface PromptHandler {
	canHandle: (fieldSchema: ZodTypeAny, fieldName: string) => boolean;
	prompt: (
		fieldSchema: ZodTypeAny,
		fieldName: string,
		message: string,
		choices?: PromptChoice[],
	) => Promise<unknown>;
}
