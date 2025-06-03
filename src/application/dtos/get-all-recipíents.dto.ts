import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { recipientSchema } from "./get-recipient.dto";

export const recipientsSchema = z.object({
	recipients: recipientSchema.array(),
	totalCount: z.number().positive(),
	totalPages: z.number().positive(),
	currentPage: z.number().positive(),
});

export class GetAllRecipientsDto extends createZodDto(recipientsSchema) {}
