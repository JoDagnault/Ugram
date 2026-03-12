CREATE TABLE "PostMention" (
                               "postId" TEXT NOT NULL,
                               "userId" TEXT NOT NULL,

                               CONSTRAINT "PostMention_pkey" PRIMARY KEY ("postId","userId")
);

-- AddForeignKey
ALTER TABLE "PostMention" ADD CONSTRAINT "PostMention_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMention" ADD CONSTRAINT "PostMention_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "PostMention" ("postId", "userId")
SELECT p.id, u.id
FROM "Post" p
         JOIN "users" u ON u.username = ANY(p.mentions)
    ON CONFLICT DO NOTHING;

ALTER TABLE "Post" DROP COLUMN "mentions";