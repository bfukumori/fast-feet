import { createZodDto } from "nestjs-zod";
import { createRecipientSchema } from "./create-recipient.dto";

export const updateRecipientSchema = createRecipientSchema.pick({
	complement: true,
});

export class UpdateRecipientDto extends createZodDto(updateRecipientSchema) {}
