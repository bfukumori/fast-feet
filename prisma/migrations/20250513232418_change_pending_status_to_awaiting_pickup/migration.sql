/*
  Warnings:

  - The values [PENDING] on the enum `PackageStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PackageStatus_new" AS ENUM ('AWAITING_PICKUP', 'PICKED_UP', 'DELIVERED', 'RETURNED');
ALTER TABLE "packages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "packages" ALTER COLUMN "status" TYPE "PackageStatus_new" USING ("status"::text::"PackageStatus_new");
ALTER TABLE "package_status_notifications" ALTER COLUMN "status" TYPE "PackageStatus_new" USING ("status"::text::"PackageStatus_new");
ALTER TYPE "PackageStatus" RENAME TO "PackageStatus_old";
ALTER TYPE "PackageStatus_new" RENAME TO "PackageStatus";
DROP TYPE "PackageStatus_old";
ALTER TABLE "packages" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PICKUP';
COMMIT;

-- AlterTable
ALTER TABLE "packages" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PICKUP';
