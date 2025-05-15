import { fakerPT_BR as faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { Package, PackageProps } from "@src/domain/entities/package";
import { toPersistence } from "@src/infrastructure/mappers/prisma-package-mapper";
import { PrismaService } from "@src/shared/database/prisma/prisma.service";

export function makePackage(override?: Partial<PackageProps>): Package {
	const pack = Package.create({
		description: faker.commerce.productDescription(),
		recipientId: faker.string.uuid(),
		...override,
	});

	return pack;
}

@Injectable()
export class PackageFactory {
	constructor(private readonly prismaService: PrismaService) {}

	async makePrismaPackage(data?: Partial<PackageProps>): Promise<Package> {
		const pack = makePackage(data);

		await this.prismaService.package.create({
			data: toPersistence(pack),
		});

		return pack;
	}
}
