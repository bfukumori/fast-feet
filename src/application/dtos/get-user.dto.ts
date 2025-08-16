import { Role } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const userSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	cpf: z.string(),
	role: z.enum(Role),
});

export class GetUserDto extends createZodDto(userSchema) {}
