import { PackageStatus } from "generated/prisma";
import { Id } from "../value-objects/id";

type InternalPackageStatusNotificationProps = {
	id?: Id;
	packageId: string;
	status: PackageStatus;
	notifiedAt?: string;
};

type PackageStatusNotificationProps = Pick<
	InternalPackageStatusNotificationProps,
	"packageId" | "status"
>;

export type RestorePackageStatusNotificationProps = Omit<
	InternalPackageStatusNotificationProps,
	"id"
> & {
	id: string;
	notifiedAt: string;
};

export class PackageStatusNotification {
	public readonly id: Id;
	public readonly packageId: string;
	public readonly status: PackageStatus;
	public readonly notifiedAt: string;

	private constructor({
		id,
		packageId,
		status,
		notifiedAt,
	}: InternalPackageStatusNotificationProps) {
		this.id = id ?? Id.create();
		this.packageId = packageId;
		this.status = status;
		this.notifiedAt = notifiedAt ?? new Date().toISOString();
	}

	static create({
		packageId,
		status,
	}: PackageStatusNotificationProps): PackageStatusNotification {
		return new PackageStatusNotification({
			packageId,
			status,
		});
	}
}
