import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createRecipientSchema = z.object({
	name: z.string(),
	street: z.string(),
	number: z.string(),
	complement: z.string().optional(),
	city: z.string(),
	state: z.string(),
	zipCode: z.string(),
});

export class CreateRecipientDto extends createZodDto(createRecipientSchema) {}

export type CreateRecipientInput = z.infer<typeof createRecipientSchema>;
