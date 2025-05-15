import { Package } from "../entities/package";

export abstract class PackageRepository {
	abstract getPackageById(id: string): Promise<Package | null>;
	abstract createPackage(pack: Package): Promise<void>;
	abstract updatePackage(pack: Package): Promise<void>;
	abstract deletePackage(id: string): Promise<void>;
}
