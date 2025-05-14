import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { createRecipientSchema } from "./create-recipient.dto";

export const updateRecipientSchema = createRecipientSchema.partial();

export class UpdateRecipientDto extends createZodDto(updateRecipientSchema) {}

export type UpdateRecipientInput = z.infer<typeof updateRecipientSchema>;
