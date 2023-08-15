-- AlterTable
ALTER TABLE "Sudoku" ADD COLUMN     "solves" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userDifficulty" DOUBLE PRECISION,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UserStats" (
    "sudokuId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "lastViewedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solvedOn" TIMESTAMP(3),
    "solveTime" INTEGER,
    "difficulty" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_sudokuId_userId_key" ON "UserStats"("sudokuId", "userId");

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_sudokuId_fkey" FOREIGN KEY ("sudokuId") REFERENCES "Sudoku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
