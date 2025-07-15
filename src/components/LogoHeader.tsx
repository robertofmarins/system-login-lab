// Componente que exibe o cabeçalho com um emoji e o nome do sistema
export default function LogoHeader() {
  return (
    <div className="flex items-center justify-center mb-6">
      {/* Emoji representando um notebook, com tamanho grande (text-4xl) e margem à direita (mr-2) */}
      <span className="text-4xl mr-2">💻</span>

      {/* Título do sistema com tamanho 2xl, texto roxo e fonte em negrito */}
      <h1 className="text-2xl font-bold text-purple-700">Sistema de Login</h1>
    </div>
  );
}
