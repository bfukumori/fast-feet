import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const updateToPickedUpSchema = z.object({
	deliveryManId: z.uuid(),
});

export class UpdateToPickedUpDto extends createZodDto(updateToPickedUpSchema) {}
