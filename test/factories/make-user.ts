import { User } from "@src/domain/entities/user";
import { UserRole } from "@src/domain/enums/user-role.enum";

export function makeUser(role: UserRole = UserRole.DELIVERY_MAN) {
	const user = {
		name: "John Doe",
		cpf: "11649425066",
		password: "#Aa12345",
		role,
	};

	return User.create(user);
}
