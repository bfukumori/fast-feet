import { createZodDto } from "nestjs-zod";
import { createUserSchema } from "./create-user.dto";

const cpfQuerySchema = createUserSchema.pick({
	cpf: true,
});

export class CpfQueryDto extends createZodDto(cpfQuerySchema) {}
