import { GetUserDto } from "@src/application/dtos/get-user.dto";
import { User } from "@src/domain/entities/user";

export function toResponse(user: User): GetUserDto {
	return {
		id: user.id.value,
		name: user.name,
		cpf: user.cpf.value,
		role: user.role,
	};
}
