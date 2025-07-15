// Importa NextResponse para construir respostas HTTP no Next.js API Routes
import { NextResponse } from 'next/server';

// Importa a instância do Prisma para acessar o banco de dados
import prisma from '@/lib/prisma';

// Define uma função assíncrona para tratar requisições DELETE à rota
// Recebe o objeto request e um contexto com params que contém o id do usuário a ser deletado
export async function DELETE(
  _request: Request, // A requisição HTTP (não usada aqui, por isso _request)
  context: { params: Promise<{ id: string }> } // O parâmetro id passado na URL, tipo string
): Promise<NextResponse> {
  // Espera resolver a Promise params e extrai o id da rota
  const { id } = await context.params;

  // Converte o id de string para número inteiro
  const parsedId = parseInt(id);

  // Se o id não for um número válido, retorna erro 400 (bad request)
  if (isNaN(parsedId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    // Usa o prisma para deletar o usuário com o id informado no banco
    const deletedUser = await prisma.user.delete({
      where: { id: parsedId },
    });

    // Se deletou com sucesso, responde JSON com mensagem e dados do usuário deletado
    return NextResponse.json(
      { message: 'Usuário excluído com sucesso', user: deletedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Se deu erro na deleção (ex: usuário não existe), loga no console e retorna erro 500 (internal server error)
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir usuário' },
      { status: 500 }
    );
  }
}
