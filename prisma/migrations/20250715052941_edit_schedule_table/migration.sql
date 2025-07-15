/*
  Warnings:

  - You are about to drop the column `description` on the `ScheduleContent` table. All the data in the column will be lost.
  - Added the required column `date` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anniversary" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "petAge" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleContent" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "ScheduleItem" ALTER COLUMN "startAt" SET DATA TYPE DATE;
