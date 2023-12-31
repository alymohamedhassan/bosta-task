-- AlterTable
ALTER TABLE "book" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "borrower" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "borrowing" ADD COLUMN     "deletedAt" TIMESTAMP(3);
