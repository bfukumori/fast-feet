import { PackageStatus } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const packageStatusNotificationSchema = z.object({
	id: z.string().uuid(),
	packageId: z.string().uuid(),
	status: z.nativeEnum(PackageStatus),
	notifiedAt: z.string(),
});

export class GetPackageStatusNotificationDto extends createZodDto(
	packageStatusNotificationSchema,
) {}
