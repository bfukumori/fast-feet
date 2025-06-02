import { Injectable } from "@nestjs/common";
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
