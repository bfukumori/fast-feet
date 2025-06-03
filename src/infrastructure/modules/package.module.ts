import { Module } from "@nestjs/common";
import { CreatePackageUseCase } from "@src/application/use-cases/create-package";
import { DeletePackageUseCase } from "@src/application/use-cases/delete-package";
import { GetAllPackagesUseCase } from "@src/application/use-cases/get-all-packages";
import { GetPackageByIdUseCase } from "@src/application/use-cases/get-package-by-id";
import { UpdateToAwaitingPickUpUseCase } from "@src/application/use-cases/update-package-to-awating-pick-up";
import { UpdateToDeliveredUseCase } from "@src/application/use-cases/update-package-to-delivered";
import { UpdateToPickedUpUseCase } from "@src/application/use-cases/update-package-to-picked-up";
import { UpdateToReturnedUseCase } from "@src/application/use-cases/update-package-to-returned";
import { DatabaseModule } from "@src/shared/database/database.module";
import { CreatePackageController } from "../controllers/create-package.controller";
import { DeletePackageController } from "../controllers/delete-package.controller";
import { GetPackageController } from "../controllers/get-package.controller";
import { UpdatePackageController } from "../controllers/update-package.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [
		CreatePackageController,
		UpdatePackageController,
		GetPackageController,
		DeletePackageController,
	],
	providers: [
		CreatePackageUseCase,
		UpdateToPickedUpUseCase,
		UpdateToAwaitingPickUpUseCase,
		UpdateToDeliveredUseCase,
		UpdateToReturnedUseCase,
		GetPackageByIdUseCase,
		DeletePackageUseCase,
		GetAllPackagesUseCase,
	],
	exports: [DatabaseModule],
})
export class PackageModule {}
