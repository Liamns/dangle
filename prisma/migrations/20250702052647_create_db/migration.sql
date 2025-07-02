-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "petname" TEXT NOT NULL,
    "petAge" TIMESTAMP(3) NOT NULL,
    "petWeight" DOUBLE PRECISION NOT NULL,
    "petGender" JSONB NOT NULL,
    "petSpec" INTEGER NOT NULL,
    "etc1" TEXT,
    "etc2" TEXT,
    "etc3" TEXT,
    "vaccinations" JSONB NOT NULL,
    "personalityScores" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anniversary" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "icon" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isDday" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anniversary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" SERIAL NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "template" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryMain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryMain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategorySub" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mainId" INTEGER NOT NULL,

    CONSTRAINT "CategorySub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleContent" (
    "id" SERIAL NOT NULL,
    "mainId" INTEGER NOT NULL,
    "subId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "ScheduleContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "alias" TEXT,
    "icon" INTEGER,
    "addedAt" TIMESTAMP(3),

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleItem" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteSubCategory" (
    "id" SERIAL NOT NULL,
    "profileId" TEXT NOT NULL,
    "subCategoryId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryMain_name_key" ON "CategoryMain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteSubCategory_profileId_subCategoryId_key" ON "FavoriteSubCategory"("profileId", "subCategoryId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategorySub" ADD CONSTRAINT "CategorySub_mainId_fkey" FOREIGN KEY ("mainId") REFERENCES "CategoryMain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleContent" ADD CONSTRAINT "ScheduleContent_subId_fkey" FOREIGN KEY ("subId") REFERENCES "CategorySub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleItem" ADD CONSTRAINT "ScheduleItem_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleItem" ADD CONSTRAINT "ScheduleItem_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ScheduleContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteSubCategory" ADD CONSTRAINT "FavoriteSubCategory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteSubCategory" ADD CONSTRAINT "FavoriteSubCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "CategorySub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
