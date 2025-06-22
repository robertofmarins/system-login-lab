import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function UserListPage() {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  useEffect(() => {
    fetch("http://localhost:4000/api/auth/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Erro ao buscar usuários:", err))
  }, [])

  const deleteUser = async (id) => {
  const confirmar = confirm("Tem certeza que deseja excluir este usuário?");
  if (!confirmar) return;

  try {
    const res = await fetch(`http://localhost:4000/api/auth/users/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setUsers(users.filter(user => user.id !== id));
    } else {
      alert("Erro ao excluir usuário");
    }
  } catch (err) {
    console.error("Erro ao excluir usuário:", err);
    alert("Erro na exclusão.");
  }
};


  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-purple-700">Usuários Cadastrados</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
      >
        Sair
      </button>
    </div>

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
            {users.map((user) => (
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
        <p>Nenhum usuário encontrado.</p>
      )}
    </div>
  </div>
)
}