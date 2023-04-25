-- CreateTable
CREATE TABLE "SavedGame" (
    "sudokuId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameData" JSONB NOT NULL,
    "savedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserStats" (
    "sudokuId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "lastViewedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookmarked" BOOLEAN,
    "solvedOn" TIMESTAMP(3),
    "solveTime" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedGame_sudokuId_userId_key" ON "SavedGame"("sudokuId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_sudokuId_userId_key" ON "UserStats"("sudokuId", "userId");

-- AddForeignKey
ALTER TABLE "SavedGame" ADD CONSTRAINT "SavedGame_sudokuId_fkey" FOREIGN KEY ("sudokuId") REFERENCES "Sudoku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedGame" ADD CONSTRAINT "SavedGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_sudokuId_fkey" FOREIGN KEY ("sudokuId") REFERENCES "Sudoku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
