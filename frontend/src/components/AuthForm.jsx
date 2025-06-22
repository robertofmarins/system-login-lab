import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthForm({ isLogin }) {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validações
    if (!validarEmail(form.email)) {
      setIsLoading(false);
      return setError("Email inválido.");
    }

    if (!isLogin && form.senha !== form.confirmarSenha) {
      setIsLoading(false);
      return setError("As senhas não coincidem.");
    }

    try {
      let data;
      if (isLogin) {
        // Login
         data = await axios.post(
          "http://localhost:4000/api/auth/login",
          {
            email: form.email,
            password: form.senha,
          }
        );

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.userId,
            name: data.name,
            email: data.email,
          })
        );
        navigate("/users");
      } else {
        // Cadastro
         data = await axios.post(
          "http://localhost:4000/api/auth/register",
          {
            name: form.nome,
            email: form.email,
            password: form.senha,
            telefone: form.telefone,
          }
        );
        alert("Cadastro realizado com sucesso! Faça login.");
        window.location.reload();
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Erro ao processar. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className={inputClass}
        required
      />
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
      {error && <p className="text-red-600 text-sm">{error}</p>}
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