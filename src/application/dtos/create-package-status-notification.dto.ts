import { PackageStatus } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createPackageStatusNotificationSchema = z.object({
	packageId: z.uuid(),
	status: z.enum(PackageStatus),
});

export class CreatePackageStatusNotificationDto extends createZodDto(
	createPackageStatusNotificationSchema,
) {}
