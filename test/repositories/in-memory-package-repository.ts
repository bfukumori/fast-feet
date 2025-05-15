import { Package } from "@src/domain/entities/package";
import { PackageRepository } from "@src/domain/repositories/package-repository";

export class InMemoryPackageRepository implements PackageRepository {
	public packs: Package[] = [];

	async createPackage(pack: Package) {
		this.packs.push(pack);
	}

	async getPackageById(id: string) {
		const pack = this.packs.find((pack) => pack.id.value === id);

		if (!pack) return null;

		return pack;
	}

	async updatePackage(pack: Package): Promise<void> {
		const packIndex = this.packs.findIndex((u) => u.id === pack.id);

		this.packs[packIndex] = pack;
	}

	async deletePackage(id: string): Promise<void> {
		const packIndex = this.packs.findIndex((pack) => pack.id.value === id);

		this.packs.splice(packIndex, 1);
	}
}
