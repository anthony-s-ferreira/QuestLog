-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_rpgId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_typeId_fkey";

-- DropForeignKey
ALTER TABLE "RPG" DROP CONSTRAINT "RPG_masterid_fkey";

-- AddForeignKey
ALTER TABLE "RPG" ADD CONSTRAINT "RPG_masterid_fkey" FOREIGN KEY ("masterid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_rpgId_fkey" FOREIGN KEY ("rpgId") REFERENCES "RPG"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
