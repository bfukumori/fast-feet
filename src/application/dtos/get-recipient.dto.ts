import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const recipientSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	street: z.string(),
	number: z.string(),
	complement: z.string().nullish(),
	city: z.string(),
	state: z.string(),
	zipCode: z.string(),
});

export class GetRecipientDto extends createZodDto(recipientSchema) {}
