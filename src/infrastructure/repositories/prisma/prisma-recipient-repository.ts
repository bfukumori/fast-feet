import { Injectable } from "@nestjs/common";
import { GetRecipientDto } from "@src/application/dtos/get-recipient.dto";
import { PaginationQueryDto } from "@src/application/dtos/pagination-query.dto";
import { Recipient } from "@src/domain/entities/recipient";
import { RecipientRepository } from "@src/domain/repositories/recipient-repository";
import {
	toDomain,
	toPersistence,
} from "@src/infrastructure/mappers/prisma-recipient-mapper";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getAll(params?: PaginationQueryDto): Promise<{
		recipients: GetRecipientDto[];
		totalCount: number;
		totalPages: number;
		currentPage: number;
	}> {
		const { limit, page } = params || { limit: 10, page: 1 };
		const skip = (page - 1) * limit;

		const [recipients, totalCount] = await Promise.all([
			this.prisma.recipient.findMany({
				skip,
				take: limit,
				orderBy: { name: "asc" },
			}),
			this.prisma.recipient.count(),
		]);

		return {
			recipients,
			totalCount,
			totalPages: Math.ceil(totalCount / limit),
			currentPage: page,
		};
	}

	async getRecipientById(id: string): Promise<Recipient | null> {
		const pack = await this.prisma.recipient.findUnique({
			where: { id },
		});

		if (!pack) {
			return null;
		}

		return toDomain(pack);
	}

	async getRecipientByCpf(id: string): Promise<Recipient | null> {
		const pack = await this.prisma.recipient.findUnique({
			where: { id },
		});

		if (!pack) {
			return null;
		}

		return toDomain(pack);
	}

	async createRecipient(pack: Recipient): Promise<void> {
		await this.prisma.recipient.create({
			data: toPersistence(pack),
		});
	}

	async updateRecipient(pack: Recipient): Promise<void> {
		await this.prisma.recipient.update({
			where: { id: pack.id.value },
			data: toPersistence(pack),
		});
	}

	async deleteRecipient(id: string): Promise<void> {
		await this.prisma.recipient.delete({
			where: { id },
		});
	}
}
