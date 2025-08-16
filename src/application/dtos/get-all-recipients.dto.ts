import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { recipientSchema } from "./get-recipient.dto";

export const recipientsSchema = z.object({
	recipients: recipientSchema.array(),
	totalCount: z.int().positive(),
	totalPages: z.int().positive(),
	currentPage: z.int().positive(),
});

export class GetAllRecipientsDto extends createZodDto(recipientsSchema) {}
