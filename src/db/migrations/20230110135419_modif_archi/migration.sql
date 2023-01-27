/*
  Warnings:

  - You are about to drop the `Coureur` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Coureur` DROP FOREIGN KEY `Coureur_courseId_fkey`;

-- DropTable
DROP TABLE `Coureur`;

-- CreateTable
CREATE TABLE `PointControle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dossard` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `distance` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PointControle` ADD CONSTRAINT `PointControle_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
