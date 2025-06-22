-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "cliente" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "telefone" TEXT;
