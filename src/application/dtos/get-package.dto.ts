import { PackageStatus } from "generated/prisma";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const packageSchema = z.object({
	id: z.string().uuid(),
	recipientId: z.string().uuid(),
	deliveryManId: z.string().uuid().nullish(),
	status: z.nativeEnum(PackageStatus),
	description: z.string(),
	pickedDate: z.string().nullish(),
	deliveredDate: z.string().nullish(),
	returnedDate: z.string().nullish(),
	deliveredPhotoUrl: z.string().url().nullish(),
});

export class GetPackageDto extends createZodDto(packageSchema) {}
