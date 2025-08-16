import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const paginationQuerySchema = z.object({
	page: z.int().positive().default(1),
	limit: z.int().positive().default(10),
});

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
