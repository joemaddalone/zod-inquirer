import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { confirmHandler } from "./confirm";

vi.mock("@inquirer/prompts", () => ({
	confirm: vi.fn(),
}));

describe("confirmHandler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("canHandle", () => {
		it("should handle z.boolean()", () => {
			const schema = z.boolean();
			expect(confirmHandler.canHandle(schema, "accept")).toBe(true);
		});

		it("should not handle z.string()", () => {
			const schema = z.string();
			expect(confirmHandler.canHandle(schema, "name")).toBe(false);
		});

		it("should not handle z.number()", () => {
			const schema = z.number();
			expect(confirmHandler.canHandle(schema, "age")).toBe(false);
		});
	});

	describe("prompt", () => {
		it("should call confirm with message", async () => {
			const { confirm } = await import("@inquirer/prompts");
			const schema = z.boolean();
			vi.mocked(confirm).mockResolvedValue(true);

			const result = await confirmHandler.prompt(
				schema,
				"accept",
				"Do you accept?",
			);

			expect(confirm).toHaveBeenCalledWith({ message: "Do you accept?" });
			expect(result).toBe(true);
		});
	});
});
