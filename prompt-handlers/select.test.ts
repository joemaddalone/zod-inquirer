import { select } from "@inquirer/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { selectHandler } from "./select";

vi.mock("@inquirer/prompts", () => ({
	select: vi.fn(),
}));

describe("selectHandler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("canHandle", () => {
		it("should handle z.enum()", () => {
			const schema = z.enum(["small", "medium", "large"]);
			expect(selectHandler.canHandle(schema, "size")).toBe(true);
		});

		it("should not handle z.string()", () => {
			const schema = z.string();
			expect(selectHandler.canHandle(schema, "name")).toBe(false);
		});

		it("should not handle z.array()", () => {
			const schema = z.array(z.string());
			expect(selectHandler.canHandle(schema, "items")).toBe(false);
		});
	});

	describe("prompt", () => {
		it("should call select with enum choices", async () => {
			const schema = z.enum(["small", "medium", "large"]);
			vi.mocked(select).mockResolvedValue("medium");

			const result = await selectHandler.prompt(schema, "size", "Select size:");

			expect(select).toHaveBeenCalledWith({
				message: "Select size:",
				choices: [
					{ name: "small", value: "small" },
					{ name: "medium", value: "medium" },
					{ name: "large", value: "large" },
				],
			});
			expect(result).toBe("medium");
		});

		it("should use description from .describe() if available", async () => {
			const schema = z.enum(["small", "medium", "large"]).describe("Choose your size");
			vi.mocked(select).mockResolvedValue("large");

			const result = await selectHandler.prompt(schema, "size", "Select size:");

			expect(select).toHaveBeenCalledWith({
				message: "Choose your size",
				choices: [
					{ name: "small", value: "small" },
					{ name: "medium", value: "medium" },
					{ name: "large", value: "large" },
				],
			});
			expect(result).toBe("large");
		});
	});
});
