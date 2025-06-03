import { GetUserDto } from "@src/application/dtos/get-user.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { User } from "@src/domain/entities/user";
import { UserRepository } from "@src/domain/repositories/user-repository";
import { Cpf } from "@src/domain/value-objects/cpf";
import { toResponse } from "@src/infrastructure/mappers/response-user-mapper";

export class InMemoryUserRepository implements UserRepository {
	public users: User[] = [];

	async getAll(param: PaginationQueryDto): Promise<{
		users: GetUserDto[];
		totalCount: number;
		totalPages: number;
		currentPage: number;
	}> {
		const totalCount = this.users.length;

		const { limit, page } = param || { limit: 10, page: 1 };
		const skip = (page - 1) * limit;

		return {
			users: this.users.slice(skip, skip + limit).map(toResponse),
			totalPages: Math.ceil(totalCount / limit),
			totalCount,
			currentPage: page,
		};
	}

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
