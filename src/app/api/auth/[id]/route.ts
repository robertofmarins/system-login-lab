import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parsedId },
    });

    return NextResponse.json(
      { message: 'Usuário excluído com sucesso', user: deletedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir usuário' },
      { status: 500 }
    );
  }
}