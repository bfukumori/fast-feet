import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const getRecipientSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	street: z.string(),
	number: z.string(),
	complement: z.string().nullish(),
	city: z.string(),
	state: z.string(),
	zipCode: z.string(),
});

export class GetRecipientDto extends createZodDto(getRecipientSchema) {}

export type GetRecipientInput = z.infer<typeof getRecipientSchema>;
