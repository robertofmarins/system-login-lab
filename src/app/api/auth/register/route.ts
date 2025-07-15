import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// CORS HEADERS
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://login.robertomarins.com.br',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Preflight handler
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, telefone } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        telefone: telefone || null,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

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
    console.error(error);
    return NextResponse.json({ error: 'Erro ao registrar usuário' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}
