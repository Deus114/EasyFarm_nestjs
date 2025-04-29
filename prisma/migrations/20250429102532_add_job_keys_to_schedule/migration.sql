-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "jobKeys" TEXT[] DEFAULT ARRAY[]::TEXT[];
