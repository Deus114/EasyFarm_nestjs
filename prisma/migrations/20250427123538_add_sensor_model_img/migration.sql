/*
  Warnings:

  - Added the required column `img` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sensor" ADD COLUMN     "img" TEXT NOT NULL;
