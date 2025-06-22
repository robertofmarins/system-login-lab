const express = require('express');
const router = express.Router();
const { register, login, listUsers, deleteUser } = require('../controllers/authController');



// Rota de cadastro
router.post('/register', register);

// Rota de login
router.post('/login', login);

// ✅ Rota para listar usuários
router.get('/users', listUsers);

// Rota para deletar usuário
router.delete('/users/:id', deleteUser);

module.exports = router;
