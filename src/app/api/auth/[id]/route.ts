import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'DELETE') return res.status(405).end();

  try {
    const user = await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: 'Usuário excluído com sucesso', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
}
