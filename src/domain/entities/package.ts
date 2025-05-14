import { DomainError } from "@src/shared/errors/domain-error";
import { PackageStatus } from "generated/prisma";
import { Id } from "../value-objects/id";

type InternalCreatePackageProps = {
	id?: Id;
	recipientId: string;
	deliveryManId?: string | null;
	status?: PackageStatus;
	description: string;
	pickedDate?: string | null;
	deliveredDate?: string | null;
	returnedDate?: string | null;
	deliveredPhotoUrl?: string | null;
};

type CreatePackageProps = Pick<
	InternalCreatePackageProps,
	"recipientId" | "description"
>;

export type RestorePackageProps = Omit<InternalCreatePackageProps, "id"> & {
	id: string;
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
	}: InternalCreatePackageProps) {
		this.id = id ?? Id.create();
		this.recipientId = recipientId;
		this.deliveryManId = deliveryManId;
		this.status = status ?? PackageStatus.AWAITING_PICKUP;
		this.pickedDate = pickedDate;
		this.deliveredDate = deliveredDate;
		this.returnedDate = returnedDate;
		this.deliveredPhotoUrl = deliveredPhotoUrl;
		this.description = description;
	}

	updateToAwaitingPickUp(): void {
		if (this.status !== PackageStatus.RETURNED) {
			throw new DomainError(
				"Package is not in a valid state to be awaited for pick up.",
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

	updateToPickedUp(deliveryManId: string): void {
		if (this.status !== PackageStatus.AWAITING_PICKUP) {
			throw new DomainError(
				"Package is not in a valid state to be picked up.",
				Package.name,
			);
		}

		if (!deliveryManId) {
			throw new DomainError(
				"Delivery Man ID is required to pick up the package.",
				Package.name,
			);
		}

		this.deliveryManId = deliveryManId;
		this.status = PackageStatus.PICKED_UP;
		this.pickedDate = new Date().toISOString();
	}

	updateToDelivered(deliveredPhotoUrl: string): void {
		if (this.status !== PackageStatus.PICKED_UP) {
			throw new DomainError(
				"Package is not in a valid state to be delivered.",
				Package.name,
			);
		}

		if (!deliveredPhotoUrl) {
			throw new DomainError(
				"Photo proof is required to mark the package as delivered.",
				Package.name,
			);
		}

		this.deliveredPhotoUrl = deliveredPhotoUrl;
		this.status = PackageStatus.DELIVERED;
		this.deliveredDate = new Date().toISOString();
	}

	updateToReturned(): void {
		if (this.status !== PackageStatus.PICKED_UP) {
			throw new DomainError(
				"Package is not in a valid state to be returned.",
				Package.name,
			);
		}
		this.status = PackageStatus.RETURNED;
		this.returnedDate = new Date().toISOString();
	}

	static create({ recipientId, description }: CreatePackageProps): Package {
		return new Package({
			recipientId,
			description,
		});
	}

	static restore({
		id,
		recipientId,
		deliveryManId,
		status,
		description,
		pickedDate,
		deliveredDate,
		returnedDate,
		deliveredPhotoUrl,
	}: RestorePackageProps): Package {
		return new Package({
			id: Id.create(id),
			recipientId,
			deliveryManId,
			description,
			status,
			pickedDate,
			deliveredDate,
			returnedDate,
			deliveredPhotoUrl,
		});
	}
}
