import { DomainError } from "@src/shared/errors/domain-error";
import { PackageStatus } from "generated/prisma";
import { Id } from "../value-objects/id";

export type InternalPackageProps = {
	id: Id;
	recipientId: string;
	deliveryManId?: string | null;
	status?: PackageStatus;
	description: string;
	pickedDate?: string | null;
	deliveredDate?: string | null;
	returnedDate?: string | null;
	deliveredPhotoUrl?: string | null;
};

export type PackageProps = Omit<InternalPackageProps, "id"> & {
	id?: string;
};

export class Package {
	public readonly id: Id;
	public readonly recipientId: string;
	public deliveryManId?: string | null;
	public status: PackageStatus;
	public readonly description: string;
	public pickedDate?: string | null;
	public deliveredDate?: string | null;
	public returnedDate?: string | null;
	public deliveredPhotoUrl?: string | null;

	private constructor({
		id,
		recipientId,
		deliveryManId,
		status,
		description,
		pickedDate,
		deliveredDate,
		returnedDate,
		deliveredPhotoUrl,
	}: InternalPackageProps) {
		this.id = id;
		this.recipientId = recipientId;
		this.deliveryManId = deliveryManId;
		this.status = status ?? PackageStatus.AWAITING_PICKUP;
		this.pickedDate = pickedDate;
		this.deliveredDate = deliveredDate;
		this.returnedDate = returnedDate;
		this.deliveredPhotoUrl = deliveredPhotoUrl;
		this.description = description;
	}

	public static readonly ERROR_MESSAGE = {
		cantAwaitPickup:
			"Package is not in a valid state to be awaited for pick up.",
		cantPickup: "Package is not in a valid state to be picked up.",
		cantDelivered: "Package is not in a valid state to be delivered.",
		cantReturned: "Package is not in a valid state to be returned.",
		deliveryManIdRequired:
			"Delivery Man ID is required to pick up the package.",
		deliveryPhotoProofRequired:
			"Photo proof is required to mark the package as delivered.",
	};

	setPhotoProofUrl(url: string): void {
		this.deliveredPhotoUrl = url;
	}

	setDeliveryManId(deliveryManId: string): void {
		this.deliveryManId = deliveryManId;
	}

	updateToAwaitingPickUp(): void {
		if (this.status !== PackageStatus.RETURNED) {
			throw new DomainError(
				Package.ERROR_MESSAGE.cantAwaitPickup,
				Package.name,
			);
		}

		this.deliveryManId = null;
		this.returnedDate = null;
		this.deliveredDate = null;
		this.pickedDate = null;
		this.deliveredPhotoUrl = null;
		this.status = PackageStatus.AWAITING_PICKUP;
	}

	updateToPickedUp(): void {
		if (this.status !== PackageStatus.AWAITING_PICKUP) {
			throw new DomainError(Package.ERROR_MESSAGE.cantPickup, Package.name);
		}

		this.status = PackageStatus.PICKED_UP;
		this.pickedDate = new Date().toISOString();
	}

	updateToDelivered(): void {
		if (this.status !== PackageStatus.PICKED_UP) {
			throw new DomainError(Package.ERROR_MESSAGE.cantDelivered, Package.name);
		}

		if (!this.deliveredPhotoUrl) {
			throw new DomainError(
				Package.ERROR_MESSAGE.deliveryPhotoProofRequired,
				Package.name,
			);
		}

		this.status = PackageStatus.DELIVERED;
		this.deliveredDate = new Date().toISOString();
	}

	updateToReturned(): void {
		if (this.status !== PackageStatus.PICKED_UP) {
			throw new DomainError(Package.ERROR_MESSAGE.cantReturned, Package.name);
		}
		this.status = PackageStatus.RETURNED;
		this.returnedDate = new Date().toISOString();
	}

	static create({
		recipientId,
		description,
		status,
		deliveredDate,
		deliveredPhotoUrl,
		deliveryManId,
		id,
		pickedDate,
		returnedDate,
	}: PackageProps): Package {
		return new Package({
			id: Id.create(id),
			recipientId,
			description,
			status,
			deliveredDate,
			deliveredPhotoUrl,
			deliveryManId,
			pickedDate,
			returnedDate,
		});
	}
}
