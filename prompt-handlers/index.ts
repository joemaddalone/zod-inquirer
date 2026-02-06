import type { PromptHandler } from "./types";
import { checkboxHandler } from "./checkbox";
import { inputHandler } from "./input";
import { selectHandler } from "./select";

export const handlers: PromptHandler[] = [
	checkboxHandler,
	selectHandler,
	inputHandler,
];
