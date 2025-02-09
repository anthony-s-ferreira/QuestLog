-- CreateTable
CREATE TABLE "RPG" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "masterid" INTEGER NOT NULL,

    CONSTRAINT "RPG_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RPG" ADD CONSTRAINT "RPG_masterid_fkey" FOREIGN KEY ("masterid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
