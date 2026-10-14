-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "releaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genreId" INTEGER NOT NULL,
    "publisherId" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Games_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genres" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Games_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publishers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Games" ("desc", "featured", "genreId", "id", "publisherId", "releaseDate", "title") SELECT "desc", "featured", "genreId", "id", "publisherId", "releaseDate", "title" FROM "Games";
DROP TABLE "Games";
ALTER TABLE "new_Games" RENAME TO "Games";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
