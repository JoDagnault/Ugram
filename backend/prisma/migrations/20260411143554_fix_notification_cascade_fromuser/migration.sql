/*
  Warnings:

  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_postId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_fromUserId_fkey";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "likes";

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
