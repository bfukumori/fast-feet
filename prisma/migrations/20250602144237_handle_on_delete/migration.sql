-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_recipient_id_fkey";

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
