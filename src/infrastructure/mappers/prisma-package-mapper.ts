import { Package } from "@src/domain/entities/package";
import { Package as PrismaPackage } from "generated/prisma";

export function toPersistence(
	pack: Package,
): Omit<PrismaPackage, "createdAt" | "updatedAt"> {
	return {
		id: pack.id.value,
		deliveryManId: pack.deliveryManId ?? null,
		recipientId: pack.recipientId,
		status: pack.status,
		description: pack.description,
		pickedDate: pack.pickedDate ? new Date(pack.pickedDate) : null,
		deliveredDate: pack.deliveredDate ? new Date(pack.deliveredDate) : null,
		deliveredPhotoUrl: pack.deliveredPhotoUrl ?? null,
		returnedDate: pack.returnedDate ? new Date(pack.returnedDate) : null,
	};
}

export function toDomain(pack: PrismaPackage): Package {
	return Package.create({
		id: pack.id,
		deliveryManId: pack.deliveryManId,
		recipientId: pack.recipientId,
		status: pack.status,
		description: pack.description,
		pickedDate: pack.pickedDate ? pack.pickedDate.toISOString() : null,
		deliveredDate: pack.deliveredDate?.toISOString(),
		deliveredPhotoUrl: pack.deliveredPhotoUrl,
		returnedDate: pack.returnedDate?.toISOString(),
	});
}
