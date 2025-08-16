import { PackageStatus } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const packageStatusNotificationSchema = z.object({
	id: z.uuid(),
	packageId: z.uuid(),
	status: z.enum(PackageStatus),
	notifiedAt: z.string(),
});

export class GetPackageStatusNotificationDto extends createZodDto(
	packageStatusNotificationSchema,
) {}
