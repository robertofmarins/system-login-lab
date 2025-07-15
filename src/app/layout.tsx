// Importa o arquivo CSS global, que será aplicado em todas as páginas do projeto
import './globals.css';

// Importa o tipo Metadata do Next.js para adicionar metadados à aplicação (título, descrição etc)
import type { Metadata } from 'next';

// Define os metadados padrão da aplicação
export const metadata: Metadata = {
  title: 'Sistema de Login', // Título da aba do navegador (default)
  description: 'Login, Cadastro e Listagem de Usuários com Next.js', // Descrição para SEO e redes sociais
};

// Esse componente representa o layout raiz da aplicação (padrão em todos os caminhos/rotas)
// Tudo o que for renderizado nas rotas (páginas) será exibido dentro do {children}
export default function RootLayout({
  children, // Representa o conteúdo da rota atual
}: {
  children: React.ReactNode; // Define o tipo children como um nó React (JSX, elementos, texto, etc.)
}) {
  return (
    // Define o idioma do site como português do Brasil
    <html lang="pt-BR">
      {/* Renderiza o conteúdo da página atual dentro da tag <body> */}
      <body>
        {children}
      </body>
    </html>
  );
}
