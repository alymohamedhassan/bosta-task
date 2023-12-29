-- CreateTable
CREATE TABLE "borrowing" (
    "id" SERIAL NOT NULL,
    "borrowerId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "borrowing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "borrowing" ADD CONSTRAINT "borrowing_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "borrower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrowing" ADD CONSTRAINT "borrowing_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
