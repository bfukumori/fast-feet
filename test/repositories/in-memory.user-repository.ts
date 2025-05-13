import { User } from "@src/domain/entities/user";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { Cpf } from "@src/domain/value-objects/cpf";

export class InMemoryUserRepository implements UserRepository {
	public users: User[] = [];

	async createUser(user: User) {
		this.users.push(user);
	}

	async getUserById(id: string) {
		const user = this.users.find((user) => user.id.value === id);

		if (!user) return null;

		return user;
	}

	async getUserByCpf(cpf: string) {
		const user = this.users.find((user) => user.cpf.equals(Cpf.create(cpf)));

		if (!user) return null;

		return user;
	}

	async updateUser(user: User): Promise<void> {
		const userIndex = this.users.findIndex((u) => u.id === user.id);

		this.users[userIndex] = user;
	}

	async deleteUser(id: string): Promise<void> {
		const userIndex = this.users.findIndex((user) => user.id.value === id);

		this.users.splice(userIndex, 1);
	}
}
