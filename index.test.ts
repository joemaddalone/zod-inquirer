import { checkbox, input, select } from "@inquirer/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { zodPrompter } from "./index";

vi.mock("@inquirer/prompts", () => ({
	input: vi.fn(),
	select: vi.fn(),
	checkbox: vi.fn(),
}));

describe("zodPrompter", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should use input for string fields", async () => {
		const schema = z.object({
			name: z.string(),
		});

		vi.mocked(input).mockResolvedValueOnce("John Doe");

		const result = await zodPrompter(schema);

		expect(input).toHaveBeenCalledWith(
			expect.objectContaining({ message: "Enter your name:" }),
		);
		expect(result).toEqual({ name: "John Doe" });
	});

	it("should use select for enum fields", async () => {
		const schema = z.object({
			size: z.enum(["small", "medium", "large"]),
		});

		vi.mocked(select).mockResolvedValue("medium");

		const result = await zodPrompter(schema);

		expect(select).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Enter your size:",
				choices: [
					{ name: "small", value: "small" },
					{ name: "medium", value: "medium" },
					{ name: "large", value: "large" },
				],
			}),
		);
		expect(result).toEqual({ size: "medium" });
	});

	it("should use checkbox for array of enum fields", async () => {
		const schema = z.object({
			toppings: z.array(z.enum(["pepperoni", "mushrooms"])),
		});

		vi.mocked(checkbox).mockResolvedValue(["pepperoni"]);

		const result = await zodPrompter(schema);

		expect(checkbox).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Enter your toppings:",
				choices: [
					{ name: "pepperoni", value: "pepperoni" },
					{ name: "mushrooms", value: "mushrooms" },
				],
			}),
		);
		expect(result).toEqual({ toppings: ["pepperoni"] });
	});

	it("should exit gracefully on Ctrl+C", async () => {
		const schema = z.object({
			name: z.string(),
		});

		vi.mocked(input).mockRejectedValue(
			new Error("User force closed the prompt with SIGINT"),
		);

		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
			throw new Error("process.exit called");
		});

		await expect(zodPrompter(schema)).rejects.toThrow("process.exit called");
		expect(exitSpy).toHaveBeenCalledWith(0);

		exitSpy.mockRestore();
	});
});
