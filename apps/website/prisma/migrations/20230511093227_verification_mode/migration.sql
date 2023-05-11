-- CreateEnum
CREATE TYPE "VerificationMode" AS ENUM ('ON_DEMAND', 'ON_COMPLETE', 'ON_INPUT');

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "verificationMode" "VerificationMode";
