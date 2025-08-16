import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { userSchema } from "./get-user.dto";

export const usersSchema = z.object({
	users: userSchema.array(),
	totalCount: z.int().positive(),
	totalPages: z.int().positive(),
	currentPage: z.int().positive(),
});

export class GetAllUsersDto extends createZodDto(usersSchema) {}
