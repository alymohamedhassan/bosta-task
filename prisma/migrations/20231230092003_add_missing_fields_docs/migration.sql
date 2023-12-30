/*
  Warnings:

  - You are about to drop the column `name` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `borrower` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shelfLocation` to the `book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalQuantity` to the `book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `borrower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registeredAt` to the `borrower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borrowingDate` to the `borrowing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnDate` to the `borrowing` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "book_name_key";

-- AlterTable
ALTER TABLE "book" DROP COLUMN "name",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "shelfLocation" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "totalQuantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "borrower" DROP COLUMN "createdAt",
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "registeredAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "borrowing" ADD COLUMN     "borrowingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returnDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "author_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "author_name_key" ON "author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "book_title_key" ON "book"("title");

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
