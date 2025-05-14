import { User } from "@src/domain/entities/user";
import { User as PrismaUser } from "generated/prisma";

export function toPersistence(user: User): PrismaUser {
	return {
		id: user.id.value,
		name: user.name,
		cpf: user.cpf.value,
		password: user.password.value,
		role: user.role,
	};
}

export function toDomain(user: PrismaUser): User {
	return User.restore({
		id: user.id,
		cpf: user.cpf,
		name: user.name,
		password: user.password,
		role: user.role,
	});
}
