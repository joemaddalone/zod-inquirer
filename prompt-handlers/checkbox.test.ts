import { checkbox } from "@inquirer/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { checkboxHandler } from "./checkbox";

vi.mock("@inquirer/prompts", () => ({
	checkbox: vi.fn(),
}));

describe("checkboxHandler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("canHandle", () => {
		it("should handle z.array(z.enum())", () => {
			const schema = z.array(z.enum(["pepperoni", "mushrooms", "onions"]));
			expect(checkboxHandler.canHandle(schema, "toppings")).toBe(true);
		});

		it("should not handle z.array(z.string())", () => {
			const schema = z.array(z.string());
			expect(checkboxHandler.canHandle(schema, "items")).toBe(false);
		});

		it("should not handle z.string()", () => {
			const schema = z.string();
			expect(checkboxHandler.canHandle(schema, "name")).toBe(false);
		});

		it("should not handle z.enum()", () => {
			const schema = z.enum(["a", "b"]);
			expect(checkboxHandler.canHandle(schema, "choice")).toBe(false);
		});
	});

	describe("prompt", () => {
		it("should call checkbox with enum choices", async () => {
			const schema = z.array(z.enum(["pepperoni", "mushrooms", "onions"]));
			vi.mocked(checkbox).mockResolvedValue(["pepperoni", "mushrooms"]);

			const result = await checkboxHandler.prompt(
				schema,
				"toppings",
				"Select toppings:",
			);

			expect(checkbox).toHaveBeenCalledWith({
				message: "Select toppings:",
				choices: [
					{ name: "pepperoni", value: "pepperoni" },
					{ name: "mushrooms", value: "mushrooms" },
					{ name: "onions", value: "onions" },
				],
			});
			expect(result).toEqual(["pepperoni", "mushrooms"]);
		});

		it("should use description from .describe() if available", async () => {
			const schema = z.array(z.enum(["a", "b"])).describe("Pick your options");
			vi.mocked(checkbox).mockResolvedValue(["a"]);

			const result = await checkboxHandler.prompt(schema, "options", "Select options:");

			expect(checkbox).toHaveBeenCalledWith({
				message: "Pick your options",
				choices: [
					{ name: "a", value: "a" },
					{ name: "b", value: "b" },
				],
			});
			expect(result).toEqual(["a"]);
		});
	});
});
