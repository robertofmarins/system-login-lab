"use client"; 
// Indica que este componente deve ser renderizado no cliente (navegador), e não no servidor (Next.js 13+ com app router exige isso em componentes com hooks, eventos etc)

import Head from "next/head"; // Importa o componente Head do Next.js para configurar <title> e <meta> da página
import { useState } from "react"; // Hook para manipular estado (login ou cadastro)
import AuthForm from "@/components/AuthForm"; // Formulário de login/cadastro
import ToggleForm from "@/components/ToggleForm"; // Botão para alternar entre login e cadastro
import LogoHeader from "@/components/LogoHeader"; // Componente de logo que aparece no topo da tela

export default function HomePage() {
  // Estado que define se estamos na tela de login (true) ou de cadastro (false)
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {/* Head é usado para definir o título da aba e meta tags SEO */}
      <Head>
        <title>Sistema de Login</title>
        <meta name="description" content="Sistema de Login Next.js" />
      </Head>

      {/* Container principal com altura mínima da tela, alinhado ao centro, com gradiente de fundo */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-4">
        
        {/* Cartão branco com bordas arredondadas, sombra, padding e largura máxima */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all">
          
          {/* Componente com a logo do sistema */}
          <LogoHeader />

          {/* Título que muda de acordo com o estado isLogin */}
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            {isLogin ? "Entrar na sua conta" : "Criar uma conta"}
          </h2>

          {/* Formulário de autenticação (passa isLogin como prop para definir se é login ou cadastro) */}
          <AuthForm isLogin={isLogin} />

          {/* Componente que alterna entre login/cadastro ao clicar em um link ou botão */}
          <ToggleForm isLogin={isLogin} setIsLogin={setIsLogin} />
        </div>
      </div>
    </>
  );
}
