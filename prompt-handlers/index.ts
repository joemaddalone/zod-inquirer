import { checkboxHandler } from "./checkbox";
import { confirmHandler } from "./confirm";
import { inputHandler } from "./input";
import { numberHandler } from "./number";
import { passwordHandler } from "./password";
import { selectHandler } from "./select";
import type { PromptHandler } from "./types";

export const handlers: PromptHandler[] = [
	checkboxHandler,
	selectHandler,
	numberHandler,
	confirmHandler,
	passwordHandler,
	inputHandler,
];
