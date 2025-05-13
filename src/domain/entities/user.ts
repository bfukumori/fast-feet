import { DomainError } from "@src/shared/errors/domain-error";
import { Role } from "generated/prisma";
import { Cpf } from "../value-objects/cpf";
import { Id } from "../value-objects/id";
import { Password } from "../value-objects/password";

export interface UserProps {
	id?: string;
	name: string;
	cpf: string;
	password: string;
	role: Role;
}

export class User {
	public readonly id: Id;
	public name: string;
	public readonly cpf: Cpf;
	public password: Password;
	public role: Role = Role.DELIVERY_MAN;

	private constructor({ name, cpf, password, role, id }: UserProps) {
		this.id = Id.create(id);
		this.name = name;
		this.cpf = Cpf.create(cpf);
		this.password = Password.createFromHashed(password);
		this.role = role;
	}

	updatePassword(password: string): void {
		this.password = Password.createFromHashed(password);
	}

	updateName(name: string): void {
		this.name = name;
	}

	updateRole(role: Role): void {
		this.role = role;
	}

	static create({ name, cpf, password, role, id }: UserProps): User {
		if (!Object.values(Role).includes(role)) {
			throw new DomainError("Invalid role", User.name);
		}

		return new User({
			id,
			name,
			cpf,
			password,
			role,
		});
	}
}
