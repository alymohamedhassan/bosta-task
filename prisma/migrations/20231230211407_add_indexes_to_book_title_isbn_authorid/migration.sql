-- CreateIndex
CREATE INDEX "book_title_isbn_authorId_idx" ON "book"("title", "isbn", "authorId");
