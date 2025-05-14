import { createZodDto } from "nestjs-zod";
import { createPackageSchema } from "./create-package.dto";

export const updatePackageSchema = createPackageSchema
	.pick({
		description: true,
	})
	.partial();

export class UpdatePackageDto extends createZodDto(updatePackageSchema) {}
