import { input } from "@inquirer/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { inputHandler } from "./input";

vi.mock("@inquirer/prompts", () => ({
	input: vi.fn(),
}));

describe("inputHandler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("canHandle", () => {
		it("should handle z.string()", () => {
			const schema = z.string();
			expect(inputHandler.canHandle(schema, "name")).toBe(true);
		});

		it("should not handle z.number()", () => {
			const schema = z.number();
			expect(inputHandler.canHandle(schema, "age")).toBe(false);
		});

		it("should not handle z.enum()", () => {
			const schema = z.enum(["a", "b"]);
			expect(inputHandler.canHandle(schema, "choice")).toBe(false);
		});
	});

	describe("prompt", () => {
		it("should call input with message", async () => {
			const schema = z.string();
			vi.mocked(input).mockResolvedValue("test value");

			const result = await inputHandler.prompt(schema, "name", "Enter name:");

			expect(input).toHaveBeenCalledWith({ message: "Enter name:" });
			expect(result).toBe("test value");
		});

		it("should use description from .describe() if available", async () => {
			const schema = z.string().describe("Your first name");
			vi.mocked(input).mockResolvedValue("John");

			const result = await inputHandler.prompt(schema, "firstName", "Enter your first name:");

			expect(input).toHaveBeenCalledWith({ message: "Your first name" });
			expect(result).toBe("John");
		});

		it("should use description from .meta() if available", async () => {
			const schema = z.string().meta({ description: "Your last name" });
			vi.mocked(input).mockResolvedValue("Doe");

			const result = await inputHandler.prompt(schema, "lastName", "Enter your last name:");

			expect(input).toHaveBeenCalledWith({ message: "Your last name" });
			expect(result).toBe("Doe");
		});
	});
});
