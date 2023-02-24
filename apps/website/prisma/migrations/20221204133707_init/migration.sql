-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'User');

-- CreateEnum
CREATE TYPE "TokenKind" AS ENUM ('VERIFY_EMAIL');

-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "kind" "TokenKind" NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sudoku" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "publicSince" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "rank" DOUBLE PRECISION NOT NULL,
    "rows" INTEGER NOT NULL,
    "columns" INTEGER NOT NULL,
    "marginTop" INTEGER,
    "marginRight" INTEGER,
    "marginBottom" INTEGER,
    "marginLeft" INTEGER,
    "cells" JSONB,
    "givens" JSONB,
    "colors" JSONB,
    "regions" JSONB,
    "extendedcages" JSONB,
    "paths" JSONB,
    "borderclues" JSONB,
    "cellclues" JSONB,
    "logic" JSONB,
    "solution" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sudoku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "userId" INTEGER NOT NULL,
    "sudokuId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("userId","sudokuId")
);

-- CreateTable
CREATE TABLE "Walkthrough" (
    "id" SERIAL NOT NULL,
    "sudokuId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "steps" JSONB NOT NULL,

    CONSTRAINT "Walkthrough_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LabelToSudoku" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Sudoku_userId_title_key" ON "Sudoku"("userId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Walkthrough_userId_sudokuId_key" ON "Walkthrough"("userId", "sudokuId");

-- CreateIndex
CREATE UNIQUE INDEX "_LabelToSudoku_AB_unique" ON "_LabelToSudoku"("A", "B");

-- CreateIndex
CREATE INDEX "_LabelToSudoku_B_index" ON "_LabelToSudoku"("B");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sudoku" ADD CONSTRAINT "Sudoku_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_sudokuId_fkey" FOREIGN KEY ("sudokuId") REFERENCES "Sudoku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Walkthrough" ADD CONSTRAINT "Walkthrough_sudokuId_fkey" FOREIGN KEY ("sudokuId") REFERENCES "Sudoku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Walkthrough" ADD CONSTRAINT "Walkthrough_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabelToSudoku" ADD CONSTRAINT "_LabelToSudoku_A_fkey" FOREIGN KEY ("A") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabelToSudoku" ADD CONSTRAINT "_LabelToSudoku_B_fkey" FOREIGN KEY ("B") REFERENCES "Sudoku"("id") ON DELETE CASCADE ON UPDATE CASCADE;
