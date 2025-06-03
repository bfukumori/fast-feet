import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { packageSchema } from "./get-package.dto";

export const packagesSchema = z.object({
	packages: packageSchema.array(),
	totalCount: z.number().positive(),
	totalPages: z.number().positive(),
	currentPage: z.number().positive(),
});

export class GetAllPackagesDto extends createZodDto(packagesSchema) {}
