// Importa NextRequest e NextResponse para manipulação das requisições e respostas no Next.js API routes
import { NextRequest, NextResponse } from 'next/server';

// Importa bcrypt para fazer hash seguro da senha
import bcrypt from 'bcryptjs';

// Importa jsonwebtoken para gerar tokens JWT para autenticação
import jwt from 'jsonwebtoken';

// Importa a instância do Prisma Client para comunicação com o banco de dados
import prisma from '@/lib/prisma';

// Define os headers CORS para permitir requisições da origem especificada
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://login.robertomarins.com.br', // Domínio permitido
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Métodos HTTP permitidos
  'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Cabeçalhos permitidos
};

// Função para lidar com requisições OPTIONS (preflight CORS)
// Retorna uma resposta vazia com os headers de CORS para o navegador validar
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders,
  });
}

// Função que trata requisições POST para registrar um novo usuário
export async function POST(request: NextRequest) {
  try {
    // Lê o corpo da requisição que deve conter name, email, password e telefone
    const body = await request.json();
    const { name, email, password, telefone } = body;

    // Verifica se já existe um usuário cadastrado com esse email
    const existingUser = await prisma.user.findUnique({ where: { email } });

    // Se já existir, retorna erro 400 com mensagem adequada
    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Cria um hash seguro da senha com bcrypt, usando 10 rounds de salt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria um novo usuário no banco com os dados enviados (senha salva como hash)
    // Se telefone não for enviado, salva null no banco
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        telefone: telefone || null,
      },
    });

    // Gera um token JWT para autenticação, com payload contendo o userId e expiração de 1 dia
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    // Retorna resposta JSON com token e dados básicos do usuário, status 201 (criado)
    return NextResponse.json({
      token,
      userId: user.id,
      name: user.name,
      email: user.email,
    }, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    // Em caso de erro inesperado, loga o erro no console e retorna 500 (erro interno)
    console.error(error);
    return NextResponse.json({ error: 'Erro ao registrar usuário' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}
