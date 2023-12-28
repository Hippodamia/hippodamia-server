-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "qqId" TEXT,
    "nick" TEXT,
    "prefix" TEXT,
    "coins" BIGINT NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("coins", "id", "nick", "prefix", "qqId") SELECT "coins", "id", "nick", "prefix", "qqId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_qqId_key" ON "User"("qqId");
CREATE UNIQUE INDEX "User_nick_key" ON "User"("nick");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
