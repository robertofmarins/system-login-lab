// Importa NextResponse para enviar respostas HTTP
import { NextResponse } from 'next/server';

// Importa a instância do Prisma Client para acessar o banco de dados
import prisma from '@/lib/prisma';

// Função para lidar com requisições GET, que retorna a lista de usuários
export async function GET() {
  try {
    // Consulta todos os usuários no banco, retornando só os campos id, name, email e telefone
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, telefone: true },
    });

    // Retorna a lista de usuários no formato JSON com status 200 (OK)
    return NextResponse.json(users);
  } catch (error) {
    // Caso ocorra um erro, imprime no console e retorna erro 500 com mensagem
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}
