/*
  Warnings:

  - You are about to drop the column `hashtags` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "hashtags";

-- CreateTable
CREATE TABLE "PostHashtag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostHashtag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostHashtag_name_idx" ON "PostHashtag"("name");

-- AddForeignKey
ALTER TABLE "PostHashtag" ADD CONSTRAINT "PostHashtag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
