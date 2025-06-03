import { GetUserDto } from "@src/application/dtos/get-user.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { User } from "../entities/user";

export abstract class UserRepository {
	abstract getUserByCpf(cpf: string): Promise<User | null>;
	abstract getUserById(id: string): Promise<User | null>;
	abstract createUser(user: User): Promise<void>;
	abstract updateUser(user: User): Promise<void>;
	abstract deleteUser(id: string): Promise<void>;
	abstract getAll(params?: PaginationQueryDto): Promise<{
		users: GetUserDto[];
		totalCount: number;
		totalPages: number;
		currentPage: number;
	}>;
}
