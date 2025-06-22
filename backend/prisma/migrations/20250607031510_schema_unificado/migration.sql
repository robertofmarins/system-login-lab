/*
  Warnings:

  - Added the required column `estabelecimentoId` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "estabelecimentoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_estabelecimentoId_fkey" FOREIGN KEY ("estabelecimentoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
