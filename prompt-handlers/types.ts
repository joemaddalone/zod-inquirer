import type { ZodTypeAny } from "zod";

export interface PromptHandler {
	canHandle: (fieldSchema: ZodTypeAny, fieldName: string) => boolean;
	prompt: (
		fieldSchema: ZodTypeAny,
		fieldName: string,
		message: string,
	) => Promise<unknown>;
}
