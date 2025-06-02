import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const updateToDeliveredSchema = z.object({
	photoProofUrl: z.string().url(),
});

export class UpdateToDeliveredDto extends createZodDto(
	updateToDeliveredSchema,
) {}
