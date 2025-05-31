import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const signinSchema = z.object({
	cpf: z.string().regex(/^\d{11}$/, { message: "Cpf must be 11 digits." }),
	password: z.string(),
});

export class SignInDto extends createZodDto(signinSchema) {}
