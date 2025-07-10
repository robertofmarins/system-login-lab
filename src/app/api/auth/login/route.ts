import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// Lista de origens permitidas (prod, preview, custom domain e localhost)
const allowedOrigins = [
  'https://login.robertomarins.com.br',
  'https://system-login-lab.vercel.app',
  'https://system-login-lab-robertofmarins.vercel.app',
  'https://system-login-lab-git-main-robertofmarins.vercel.app',
  'http://localhost:5173',
];

// Função para gerar headers de CORS de forma dinâmica
function getCorsHeaders(origin: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

// Handler para requisição de preflight (OPTIONS)
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

// Handler para requisição POST (login)
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
        status: 401,
        headers: corsHeaders,
      });
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
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erro ao fazer login' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
