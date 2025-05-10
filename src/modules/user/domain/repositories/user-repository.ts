import { User } from "../entities/user";

export abstract class UserRepository {
	abstract getUserById(id: string): Promise<User | null>;
	abstract getUserByCpf(cpf: string): Promise<User | null>;
	abstract createUser(user: User): Promise<void>;
	abstract updateUser(user: User): Promise<void>;
	abstract deleteUser(id: string): Promise<void>;
}
