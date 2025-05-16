import { DomainError } from "@src/shared/errors/domain-error";
import { Role } from "generated/prisma";
import { Cpf } from "../value-objects/cpf";
import { Id } from "../value-objects/id";
import { Password } from "../value-objects/password";

type InternalUserProps = {
	id: Id;
	name: string;
	cpf: Cpf;
	password: Password;
	role: Role;
};

export type UserProps = {
	id?: string;
	name: string;
	cpf: string;
	password: string;
	role: Role;
};

export class User {
	public static readonly ERROR_MESSAGE = {
		invalidRole: "Invalid role",
		alreadyExists: "User already exists.",
	};

	public readonly id: Id;
	public name: string;
	public readonly cpf: Cpf;
	public password: Password;
	public role: Role;

	private constructor({ name, cpf, password, role, id }: InternalUserProps) {
		this.id = id;
		this.name = name;
		this.cpf = cpf;
		this.password = password;
		this.role = role;
	}

	changePassword(password: string): void {
		this.password = Password.createFromHashed(password);
	}

	updateName(name: string): void {
		this.name = name;
	}

	updateRole(role: Role): void {
		User.validateRole(role);

		this.role = role;
	}

	static create({ name, cpf, password, role, id }: UserProps): User {
		User.validateRole(role);

		return new User({
			id: Id.create(id),
			name,
			cpf: Cpf.create(cpf),
			password: Password.createFromHashed(password),
			role,
		});
	}

	private static validateRole(role: Role): void {
		if (!Object.values(Role).includes(role)) {
			throw new DomainError("Invalid role", User.name);
		}
	}
}
