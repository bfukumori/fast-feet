import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const paginationQuerySchema = z.object({
	page: z.number().positive().default(1),
	limit: z.number().positive().default(10),
});

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
