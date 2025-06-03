import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { userSchema } from "./get-user.dto";

export const usersSchema = z.object({
	users: userSchema.array(),
	totalCount: z.number().positive(),
	totalPages: z.number().positive(),
	currentPage: z.number().positive(),
});

export class GetAllUsersDto extends createZodDto(usersSchema) {}
