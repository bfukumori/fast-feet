import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const updatePasswordSchema = z
	.object({
		password: z.string(),
		repeatPassword: z.string(),
	})
	.refine((v) => v.password === v.repeatPassword, {
		message: "Passwords don't match.",
	});

export class UpdatePasswordDto extends createZodDto(updatePasswordSchema) {}

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
