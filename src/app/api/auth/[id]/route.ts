import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// OBS: App Router usa `context` como segundo parâmetro
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const user = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Usuário excluído com sucesso', user });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
}
