import { UserDto } from "@src/application/dtos/user-dto";
import { User } from "@src/domain/entities/user";

export function toResponse(user: User): UserDto {
	return {
		id: user.id.value,
		name: user.name,
		cpf: user.cpf.value,
		role: user.role,
	};
}
