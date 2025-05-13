import { Injectable } from "@nestjs/common";
import { User, UserProps } from "@src/domain/entities/user";
import { toPersistence } from "@src/infrastructure/mappers/prisma-user-mapper";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";
import { Role } from "generated/prisma";

export function makeUser(override?: Partial<UserProps>): User {
	const user = User.create({
		name: "John Doe",
		cpf: "11649425066",
		password: "#Aa12345",
		role: Role.DELIVERY_MAN,
		...override,
	});

	return user;
}

@Injectable()
export class UserFactory {
	constructor(private readonly prismaService: PrismaService) {}

	async makePrismaUser(data?: Partial<UserProps>): Promise<User> {
		const user = makeUser(data);

		await this.prismaService.user.create({
			data: toPersistence(user),
		});

		return user;
	}
}
