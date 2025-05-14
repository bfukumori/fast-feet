import { PackageStatus } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createPackageStatusNotificationSchema = z.object({
	packageId: z.string().uuid(),
	status: z.nativeEnum(PackageStatus),
});

export class CreatePackageStatusNotificationDto extends createZodDto(
	createPackageStatusNotificationSchema,
) {}

export type CreatePackageStatusNotificationInput = z.infer<
	typeof createPackageStatusNotificationSchema
>;
