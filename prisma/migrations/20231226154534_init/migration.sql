-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nick" TEXT,
    "prefix" TEXT,
    "coins" BIGINT NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "RaceRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "mode" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RaceRanking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rank" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "RaceRanking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RaceRanking_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "RaceRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "desc" TEXT
);

-- CreateTable
CREATE TABLE "ShopItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "desc" TEXT,
    "price" BIGINT NOT NULL DEFAULT 0,
    "shopId" INTEGER NOT NULL,
    CONSTRAINT "ShopItem_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nick_key" ON "User"("nick");
