import { GetPackageDto } from "@src/application/dtos/get-package.dto";
import { Package } from "@src/domain/entities/package";

export function toResponse(pack: Package): GetPackageDto {
	return {
		id: pack.id.value,
		deliveryManId: pack.deliveryManId,
		recipientId: pack.recipientId,
		status: pack.status,
		description: pack.description,
		pickedDate: pack.pickedDate,
		deliveredDate: pack.deliveredDate,
		deliveredPhotoUrl: pack.deliveredPhotoUrl,
		returnedDate: pack.returnedDate,
	};
}
