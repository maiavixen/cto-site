/*
  Warnings:

  - Added the required column `activity` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "location" TEXT NOT NULL,
    "dateTimeOfObservation" DATETIME NOT NULL,
    "bird" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "imgURL" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "activity" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "bird", "comment", "createdAt", "dateTimeOfObservation", "duration", "id", "imgURL", "location", "updatedAt") SELECT "authorId", "bird", "comment", "createdAt", "dateTimeOfObservation", "duration", "id", "imgURL", "location", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
