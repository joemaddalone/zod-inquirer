import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { passwordHandler } from "./password";

vi.mock("@inquirer/prompts", () => ({
	password: vi.fn(),
}));

describe("passwordHandler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("canHandle", () => {
		it("should handle z.string() with field name 'password'", () => {
			const schema = z.string();
			expect(passwordHandler.canHandle(schema, "password")).toBe(true);
		});

		it("should handle z.string() with field name 'secret'", () => {
			const schema = z.string();
			expect(passwordHandler.canHandle(schema, "secret")).toBe(true);
		});

		it("should handle z.string() with field name 'apiKey'", () => {
			const schema = z.string();
			expect(passwordHandler.canHandle(schema, "apiKey")).toBe(true);
		});

		it("should handle z.string() with field name 'token'", () => {
			const schema = z.string();
			expect(passwordHandler.canHandle(schema, "token")).toBe(true);
		});

		it("should not handle z.string() with field name 'name'", () => {
			const schema = z.string();
			expect(passwordHandler.canHandle(schema, "name")).toBe(false);
		});

		it("should not handle z.number() even with field name 'password'", () => {
			const schema = z.number();
			expect(passwordHandler.canHandle(schema, "password")).toBe(false);
		});
	});

	describe("prompt", () => {
		it("should call password with message", async () => {
			const { password } = await import("@inquirer/prompts");
			const schema = z.string();
			vi.mocked(password).mockResolvedValue("secret123");

			const result = await passwordHandler.prompt(
				schema,
				"password",
				"Enter password:",
			);

			expect(password).toHaveBeenCalledWith({ message: "Enter password:" });
			expect(result).toBe("secret123");
		});
	});
});
