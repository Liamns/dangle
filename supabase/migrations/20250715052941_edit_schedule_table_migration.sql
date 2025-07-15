/*
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
*/