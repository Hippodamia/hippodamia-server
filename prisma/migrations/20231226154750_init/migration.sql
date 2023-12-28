/*
  Warnings:

  - Added the required column `qqId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "qqId" TEXT NOT NULL,
    "nick" TEXT,
    "prefix" TEXT,
    "coins" BIGINT NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("coins", "id", "nick", "prefix") SELECT "coins", "id", "nick", "prefix" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_nick_key" ON "User"("nick");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
