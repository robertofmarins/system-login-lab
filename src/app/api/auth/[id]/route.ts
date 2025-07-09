import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const user = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Usuário excluído com sucesso', user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
}