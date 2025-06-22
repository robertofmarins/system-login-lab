/*
  Warnings:

  - You are about to drop the column `estabelecimentoId` on the `Produto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_estabelecimentoId_fkey";

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "estabelecimentoId";
