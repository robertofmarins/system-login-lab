// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UserListPage from "./pages/UserListPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />         {/* Login/Cadastro como página inicial */}
        <Route path="/users" element={<UserListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
