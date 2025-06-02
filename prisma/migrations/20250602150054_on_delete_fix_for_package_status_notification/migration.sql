-- DropForeignKey
ALTER TABLE "package_status_notifications" DROP CONSTRAINT "package_status_notifications_package_id_fkey";

-- AddForeignKey
ALTER TABLE "package_status_notifications" ADD CONSTRAINT "package_status_notifications_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
