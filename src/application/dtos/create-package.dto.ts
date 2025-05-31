import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createPackageSchema = z.object({
	recipientId: z.string().uuid(),
	description: z.string(),
});

export class CreatePackageDto extends createZodDto(createPackageSchema) {}
