'use client'; // Marca este componente como um componente client-side (necessário para hooks como useState e useRouter)

import { useState } from "react";
import { useRouter } from "next/navigation"; // Hook de navegação para redirecionar o usuário
import axios from "axios";

// Base da URL da API, vinda do .env.local
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AuthFormProps {
  isLogin: boolean; // Define se o formulário está em modo login ou cadastro
}

// Tipo esperado da resposta de login
interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
}

// Tipo esperado da resposta de cadastro (ajuste conforme sua API)
interface RegisterResponse {
  message?: string;
  userId?: number;
}

export default function AuthForm({ isLogin }: AuthFormProps) {
  // Estado para armazenar os dados do formulário
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [error, setError] = useState(""); // Armazena mensagem de erro
  const [isLoading, setIsLoading] = useState(false); // Indica se está processando
  const router = useRouter(); // Hook de navegação

  // Atualiza o estado ao digitar nos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Valida o email usando expressão regular
  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Função executada ao enviar o formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página
    setIsLoading(true); // Ativa o carregamento
    setError(""); // Limpa erros anteriores

    // Validação simples de email
    if (!validarEmail(form.email)) {
      setIsLoading(false);
      return setError("Email inválido.");
    }

    // Se for cadastro, valida se as senhas coincidem
    if (!isLogin && form.senha !== form.confirmarSenha) {
      setIsLoading(false);
      return setError("As senhas não coincidem.");
    }

    try {
      // Se for login
      if (isLogin) {
        const response = await axios.post<LoginResponse>(
          `${BASE_URL}/api/auth/login`,
          {
            email: form.email,
            password: form.senha,
          }
        );

        // Salva dados no localStorage para manter o usuário autenticado
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.userId,
            name: response.data.name,
            email: response.data.email,
          })
        );

        router.push("/users"); // Redireciona para a página de usuários
      } else {
        // Se for cadastro
        await axios.post<RegisterResponse>(
          `${BASE_URL}/api/auth/register`,
          {
            name: form.nome,
            email: form.email,
            password: form.senha,
            telefone: form.telefone,
          }
        );

        alert("Cadastro realizado com sucesso! Faça login.");
        window.location.reload(); // Recarrega a página para exibir o formulário de login
      }
    } catch (error: unknown) {
      // Tratamento de erros
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || "Erro ao processar. Tente novamente mais tarde.");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao processar. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  // Classe CSS base para os inputs
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Campos adicionais se for cadastro */}
      {!isLogin && (
        <>
          <input
            name="nome"
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            name="telefone"
            type="tel"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </>
      )}

      {/* Campo de email */}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className={inputClass}
        required
      />

      {/* Campo de senha */}
      <input
        name="senha"
        type="password"
        placeholder="Senha"
        value={form.senha}
        onChange={handleChange}
        className={inputClass}
        required
        minLength={6}
      />

      {/* Campo para confirmar senha, se for cadastro */}
      {!isLogin && (
        <input
          name="confirmarSenha"
          type="password"
          placeholder="Confirme a senha"
          value={form.confirmarSenha}
          onChange={handleChange}
          className={inputClass}
          required
          minLength={6}
        />
      )}

      {/* Exibe erro, se houver */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Botão de enviar (com loading) */}
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-70"
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
      </button>
    </form>
  );
}
