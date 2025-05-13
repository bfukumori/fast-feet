import { Role } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const userSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	cpf: z.string(),
	role: z.enum([Role.ADMIN, Role.DELIVERY_MAN]),
});

export class UserDto extends createZodDto(userSchema) {}
