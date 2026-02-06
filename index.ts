// zod-inquirer: A Zod Inquirer.js Prompt Library
//
// Developed by Joe Maddalone
// https://github.com/joemaddalone/zod-inquirer
//
// MIT License
//
// Copyright (c) 2026 Joe Maddalone
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { input, checkbox, select } from '@inquirer/prompts';
import type { ZodObject, ZodRawShape, ZodTypeAny } from "zod";


export interface SchemaPrompterOptions {
	maxRetries?: number;
	hint?: string;
}

export const zodPrompter = async (
	ZodSchema: ZodObject<ZodRawShape>,
	options: SchemaPrompterOptions = {},
) => {
	// Dynamically build prompts from the ZodSchema so we don't hardcode fields
	const schema = ZodSchema;
	const schemaShape = schema.shape;
	const fields: string[] = Object.keys(schemaShape || {});

	const answers: Record<string, unknown> = {};

	const maxRetries = typeof options.maxRetries === "number" ? options.maxRetries : 3;
	const hint = options.hint ?? "press Ctrl+C to abort";

	for (const key of fields) {
		const message = `Enter your ${key.replace(/([A-Z])/g, " $1").toLowerCase()}:`;

		// Validate the input using the Zod schema and reprompt until valid
		const fieldSchema = schemaShape[key] as ZodTypeAny;
		let attempts = 0;
		while (true) {
			let value: unknown;

			const def = (fieldSchema as unknown as { _def: { typeName: string; values?: string[]; type?: { _def: { typeName: string; values?: string[]; }; }; }; })._def;

			if (def.typeName === "ZodEnum") {
				const enumValues = def.values || [];
				value = await select({
					message,
					choices: enumValues.map((v: string) => ({ name: v, value: v }))
				});
			} else if (
				def.typeName === "ZodArray" &&
				def.type?._def?.typeName === "ZodEnum"
			) {
				const elementDef = def.type._def;
				const enumValues = elementDef.values || [];
				value = await checkbox({
					message,
					choices: enumValues.map((v: string) => ({ name: v, value: v }))
				});
			} else {
				value = await input({ message });
			}

			const result = fieldSchema.safeParse(value);
			if (result.success) {
				answers[key] = result.data;
				break;
			}

			attempts++;
			console.log(`Invalid value for ${key}: ${result.error.issues[0].message} (${attempts}/${maxRetries}). ${hint}`);
			if (attempts >= maxRetries) {
				throw new Error(`Too many invalid attempts for ${key}`);
			}
		}
	}

	return answers;
};