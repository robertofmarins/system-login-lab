// Define as propriedades esperadas pelo componente ToggleForm
interface ToggleFormProps {
  isLogin: boolean; // Indica se o formulário atual é de login
  setIsLogin: (value: boolean) => void; // Função para alternar entre login e cadastro
}

// Componente responsável por exibir a opção de alternar entre login e cadastro
export default function ToggleForm({ isLogin, setIsLogin }: ToggleFormProps) {
  return (
    <p className="mt-4 text-center text-sm text-gray-600">
      {/* Texto condicional baseado no estado atual do formulário */}
      {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
      
      {/* Botão que alterna entre login e cadastro ao ser clicado */}
      <button
        onClick={() => setIsLogin(!isLogin)} // Inverte o estado atual
        className="text-purple-600 font-medium hover:underline" // Estilização do botão
      >
        {isLogin ? "Cadastre-se" : "Entrar"} {/* Texto do botão também é condicional */}
      </button>
    </p>
  );
}