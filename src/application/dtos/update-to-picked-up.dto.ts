import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const updateToPickedUpSchema = z.object({
	deliveryManId: z.string().uuid(),
});

export class UpdateToPickedUpDto extends createZodDto(updateToPickedUpSchema) {}
