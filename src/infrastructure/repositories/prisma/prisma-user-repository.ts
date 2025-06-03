import { Injectable } from "@nestjs/common";
import { GetUserDto } from "@src/application/dtos/get-user.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { User } from "@src/domain/entities/user";
import { UserRepository } from "@src/domain/repositories/user-repository";
import {
	toDomain,
	toPersistence,
} from "@src/infrastructure/mappers/prisma-user-mapper";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";

@Injectable()
export class PrismaUserRepository implements UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getAll(params?: PaginationQueryDto): Promise<{
		users: GetUserDto[];
		totalCount: number;
		totalPages: number;
		currentPage: number;
	}> {
		const { limit, page } = params || { limit: 10, page: 1 };
		const skip = (page - 1) * limit;

		const [users, totalCount] = await Promise.all([
			this.prisma.user.findMany({
				skip,
				take: limit,
				orderBy: { name: "asc" },
			}),
			this.prisma.user.count(),
		]);

		return {
			users,
			totalCount,
			totalPages: Math.ceil(totalCount / limit),
			currentPage: page,
		};
	}

	async getUserById(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			return null;
		}

		return toDomain(user);
	}

	async getUserByCpf(cpf: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { cpf },
		});

		if (!user) {
			return null;
		}

		return toDomain(user);
	}

	async createUser(user: User): Promise<void> {
		await this.prisma.user.create({
			data: toPersistence(user),
		});
	}

	async updateUser(user: User): Promise<void> {
		await this.prisma.user.update({
			where: { id: user.id.value },
			data: toPersistence(user),
		});
	}

	async deleteUser(id: string): Promise<void> {
		await this.prisma.user.delete({
			where: { id },
		});
	}
}
