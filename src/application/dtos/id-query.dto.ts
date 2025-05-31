import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const idQuerySchema = z.object({
	id: z.string().uuid(),
});

export class IdQueryDto extends createZodDto(idQuerySchema) {}
