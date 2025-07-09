interface ToggleFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export default function ToggleForm({ isLogin, setIsLogin }: ToggleFormProps) {
  return (
    <p className="mt-4 text-center text-sm text-gray-600">
      {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-purple-600 font-medium hover:underline"
      >
        {isLogin ? "Cadastre-se" : "Entrar"}
      </button>
    </p>
  );
}
