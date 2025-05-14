import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const updateToDeliveredSchema = z.object({
	deliveredPhotoUrl: z.string().url(),
});

export class UpdateToDeliveredDto extends createZodDto(
	updateToDeliveredSchema,
) {}

export type UpdateToDeliveredInput = z.infer<typeof updateToDeliveredSchema>;
