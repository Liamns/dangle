/*
-- AddForeignKey
ALTER TABLE "Anniversary" ADD CONSTRAINT "Anniversary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
*/