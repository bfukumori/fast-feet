import { Role } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const userSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	cpf: z.string(),
	role: z.nativeEnum(Role),
});

export class GetUserDto extends createZodDto(userSchema) {}
