import { DomainError } from "@src/shared/errors/domain-error";
import { Role } from "generated/prisma";
import { Cpf } from "../value-objects/cpf";
import { Password } from "../value-objects/password";

interface UserProps {
	id?: string;
	name: string;
	cpf: string;
	password: string;
	role: Role;
}

export class User {
	public readonly id?: string;
	public readonly name: string;
	public readonly cpf: Cpf;
	public readonly password: Password;
	public readonly role: Role = Role.DELIVERY_MAN;

	private constructor({ name, cpf, password, role, id }: UserProps) {
		this.id = id;
		this.name = name;
		this.cpf = Cpf.create(cpf);
		this.password = Password.createFromHashed(password);
		this.role = role;
	}

	static create({ name, cpf, password, role }: UserProps): User {
		if (!Object.values(Role).includes(role)) {
			throw new DomainError("Invalid role", User.name);
		}

		return new User({
			name,
			cpf,
			password,
			role,
		});
	}

	static rehydrate({ name, cpf, password, role, id }: UserProps): User {
		return new User({
			id,
			name,
			cpf,
			password,
			role,
		});
	}
}
