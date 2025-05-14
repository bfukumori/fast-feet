import { PackageStatus } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const packageSchema = z.object({
	id: z.string().uuid(),
	recipientId: z.string().uuid(),
	deliveryManId: z.string().uuid().nullable(),
	status: z.nativeEnum(PackageStatus),
	description: z.string(),
	pickedDate: z.string().nullable(),
	deliveredDate: z.string().nullable(),
	returnedDate: z.string().nullable(),
	deliveredPhotoUrl: z.string().url().nullable(),
});

export class GetPackageDto extends createZodDto(packageSchema) {}
