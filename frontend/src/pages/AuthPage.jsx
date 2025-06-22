import { useState } from "react";
import AuthForm from "../components/AuthForm";
import ToggleForm from "../components/ToggleForm";
import LogoHeader from "../components/LogoHeader";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all">
        <LogoHeader />
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          {isLogin ? "Entrar na sua conta" : "Criar uma conta"}
        </h2>
        <AuthForm isLogin={isLogin} />
        <ToggleForm isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
    </div>
  );
}
