import { Role } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createUserSchema = z.object({
	name: z.string(),
	cpf: z.string().regex(/^\d{11}$/, { message: "Cpf must be 11 digits." }),
	password: z.string(),
	role: z.nativeEnum(Role).optional().default(Role.DELIVERY_MAN),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}

export type CreateUserInput = z.infer<typeof createUserSchema>;
