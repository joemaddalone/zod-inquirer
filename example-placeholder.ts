import { z } from "zod";
import { zodPrompter } from "./index";

const UserSchema = z.object({
	name: z.string().describe("Enter your name").default("e.g. John Doe"),
	email: z.string().email().describe("Enter your email").default("user@example.com"),
	username: z.string().default("e.g. johndoe123"),
});

const user = await zodPrompter(UserSchema);
console.log("User data:", user);
