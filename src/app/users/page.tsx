'use client'; // Indica que esse componente será renderizado no cliente (necessário para usar hooks como useState e useEffect)

import { useEffect, useState } from "react"; // Hooks do React para efeito colateral e controle de estado
import { useRouter } from "next/navigation"; // Hook do Next.js para navegação no lado do cliente

// Interface que define o formato de um objeto "usuário"
interface User {
  id: number;
  name: string;
  email: string;
  telefone?: string; // telefone é opcional
}

// Componente principal da página de listagem de usuários
export default function UserListPage() {
  // users guarda a lista de usuários retornada da API
  const [users, setUsers] = useState<User[]>([]);
  // loading controla se os dados ainda estão sendo carregados
  const [loading, setLoading] = useState(true);
  // router permite redirecionar o usuário
  const router = useRouter();

  // Função chamada ao clicar em "Sair"
  const handleLogout = () => {
    // Remove token e dados do usuário do localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redireciona para a página de login (raiz)
    router.push("/");
  };

  // useEffect é executado assim que o componente é montado
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Se não tiver token, redireciona imediatamente para a página de login
      router.replace("/");
      return;
    }

    // Se tiver token, busca os usuários cadastrados
    fetch('/api/auth/users')
      .then(res => {
        if (!res.ok) throw new Error("Falha ao buscar usuários");
        return res.json(); // converte para JSON
      })
      .then(data => {
        setUsers(data); // salva usuários no estado
        setLoading(false); // encerra carregamento
      })
      .catch(err => {
        console.error("Erro ao buscar usuários:", err);
        setLoading(false); // mesmo em erro, encerra carregamento
      });
  }, [router]);

  // Função para deletar um usuário pelo ID
  const deleteUser = async (id: number) => {
    const confirmar = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/auth/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove o usuário deletado da lista atual sem recarregar
        setUsers(users.filter(user => user.id !== id));
      } else {
        alert("Erro ao excluir usuário");
      }
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      alert("Erro na exclusão.");
    }
  };

  // Se ainda estiver carregando, mostra uma animação de loading (spinner)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Retorno do componente (interface com os dados dos usuários)
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Cabeçalho com título e botão de logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Usuários Cadastrados</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Sair
        </button>
      </div>

      {/* Tabela de usuários */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
        {users.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nome</th>
                <th className="py-2 px-4 border-b">Telefone</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.telefone || "-"}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Caso não haja usuários cadastrados
          <p>Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}