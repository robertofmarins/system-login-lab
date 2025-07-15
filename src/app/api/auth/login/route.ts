// Importa NextRequest para manipular a requisição no Next.js API Routes
import { NextRequest } from 'next/server';

// Importa bcrypt para comparar senhas com hash de forma segura
import bcrypt from 'bcryptjs';

// Importa jsonwebtoken para criar tokens JWT de autenticação
import jwt from 'jsonwebtoken';

// Importa a instância do Prisma para consulta no banco
import prisma from '@/lib/prisma';

// Define uma lista de origens permitidas para CORS (controle de acesso de domínios)
const allowedOrigins = [
  'https://login.robertomarins.com.br',
  'https://system-login-lab.vercel.app',
  'https://system-login-lab-robertofmarins.vercel.app',
  'https://system-login-lab-git-main-robertofmarins.vercel.app',
  'http://localhost:5173',
];

// Função que monta os headers CORS dinamicamente conforme a origem da requisição
function getCorsHeaders(origin: string | null): HeadersInit {
  const headers: HeadersInit = {
    // Métodos HTTP permitidos para esta rota
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    // Cabeçalhos permitidos na requisição
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Se a origem da requisição estiver na lista permitida, adiciona o header para permitir essa origem
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

// Handler para requisições OPTIONS (preflight CORS)
// Responde com status 204 (sem conteúdo) e os headers CORS adequados
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

// Handler para requisições POST (login)
export async function POST(request: NextRequest) {
  // Pega a origem da requisição para montar os headers CORS
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    // Lê o corpo da requisição JSON (email e password enviados pelo front)
    const body = await request.json();
    const { email, password } = body;

    // Busca o usuário no banco pelo email usando Prisma
    const user = await prisma.user.findUnique({ where: { email } });

    // Se não encontrar usuário, retorna 401 (não autorizado) com mensagem de erro
    if (!user) {
      return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Compara a senha enviada com a senha hash armazenada no banco
    const validPassword = await bcrypt.compare(password, user.password);

    // Se a senha não for válida, retorna 401 com mensagem de erro
    if (!validPassword) {
      return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Se senha válida, gera um token JWT com o id do usuário e expiração de 1 dia
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!, // variável secreta para assinatura do token (deve estar no .env)
      { expiresIn: '1d' }
    );

    // Retorna o token e alguns dados do usuário no corpo da resposta com status 200
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
    // Em caso de erro inesperado, loga no console e retorna erro 500
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erro ao fazer login' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
