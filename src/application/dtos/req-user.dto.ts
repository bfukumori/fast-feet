import { Role } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const reqUserSchema = z.object({
	user: z.object({
		sub: z.string().uuid(),
		role: z.nativeEnum(Role),
		iat: z.number(),
		exp: z.number(),
	}),
});

export class ReqUserDto extends createZodDto(reqUserSchema) {}
