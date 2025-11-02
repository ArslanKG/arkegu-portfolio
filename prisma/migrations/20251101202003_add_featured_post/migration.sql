-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "BlogPost_isFeatured_published_idx" ON "BlogPost"("isFeatured", "published");
