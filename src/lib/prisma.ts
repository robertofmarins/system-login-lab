// Importa o PrismaClient da biblioteca do Prisma, que é o cliente para conectar e consultar o banco de dados
import { PrismaClient } from '@prisma/client';

// Cria uma nova instância do PrismaClient.
// Essa instância será usada para fazer consultas, inserções, atualizações, deleções no banco.
const prisma = new PrismaClient();

// Exporta essa instância como padrão para que outros arquivos possam importar e usar essa conexão com o banco.
export default prisma;