import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://login.robertomarins.com.br',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Lida com o preflight request
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Lida com o login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return new Response(
      JSON.stringify({
        token,
        userId: user.id,
        name: user.name,
        email: user.email,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Erro ao fazer login' }),
      { status: 500, headers: corsHeaders }
    );
  }
}