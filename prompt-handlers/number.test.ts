import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { numberHandler } from "./number";

vi.mock("@inquirer/prompts", () => ({
	number: vi.fn(),
}));

describe("numberHandler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("canHandle", () => {
		it("should handle z.number()", () => {
			const schema = z.number();
			expect(numberHandler.canHandle(schema, "age")).toBe(true);
		});

		it("should not handle z.string()", () => {
			const schema = z.string();
			expect(numberHandler.canHandle(schema, "name")).toBe(false);
		});

		it("should not handle z.enum()", () => {
			const schema = z.enum(["a", "b"]);
			expect(numberHandler.canHandle(schema, "choice")).toBe(false);
		});
	});

	describe("prompt", () => {
		it("should call number with message", async () => {
			const { number } = await import("@inquirer/prompts");
			const schema = z.number();
			vi.mocked(number).mockResolvedValue(42);

			const result = await numberHandler.prompt(schema, "age", "Enter age:");

			expect(number).toHaveBeenCalledWith({ message: "Enter age:" });
			expect(result).toBe(42);
		});
	});
});
