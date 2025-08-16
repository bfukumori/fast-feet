import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { packageSchema } from "./get-package.dto";

export const packagesSchema = z.object({
	packages: packageSchema.array(),
	totalCount: z.int().positive(),
	totalPages: z.int().positive(),
	currentPage: z.int().positive(),
});

export class GetAllPackagesDto extends createZodDto(packagesSchema) {}
