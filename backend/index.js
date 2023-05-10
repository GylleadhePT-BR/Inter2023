const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const Usuarios = require('./usuario');
const { Op } = require('sequelize');

// Configurações do banco de dados
const sequelize = new Sequelize('cinema', 'root', 'bfecac3de@881234', {
  host: 'localhost',
  dialect: 'mysql'
});

// Definição do modelo de dados
const Reserva = sequelize.define('Reserva', {
  nome_cliente: DataTypes.STRING,
  codigo_compra: {
    type: DataTypes.STRING,
    defaultValue: function () {
      return uuidv4();
    }
  },
  num_cadeira: DataTypes.INTEGER,
  sessao: DataTypes.INTEGER,
  nome_filme: DataTypes.STRING
});

// Criação do servidor Express
const app = express();

// Configuração do Body-parser para interpretar JSON
app.use(bodyParser.json());

// Rota para verificar a disponibilidade de uma cadeira
app.get('/cadeiras/:sessao/:num_cadeira', async (req, res) => {
  const { sessao, num_cadeira } = req.params;
  
  // Busca por uma reserva com a mesma sessão e cadeira, que não tenha sido cancelada
  const reserva = await Reserva.findOne({
    where: {
      sessao: sessao,
      num_cadeira: num_cadeira,
      [Op.or]: [
        { status: { [Op.ne]: 'CANCELADA' } },
        { status: { [Op.eq]: null } }
      ]
    }
  });

  if (reserva) {
    // Se a cadeira já foi reservada para outro cliente, retorna um erro 409 (conflito)
    if (reserva.nome_cliente !== req.body.nome_cliente) {
      res.status(409).json({ message: 'Cadeira já reservada' });
    } else {
      // Se a cadeira já foi reservada para o mesmo cliente, retorna um status 200 (OK)
      res.status(200).json({ message: 'Cadeira disponível' });
    }
  } else {
    // Se a cadeira está disponível, retorna um status 200 (OK)
    res.status(200).json({ message: 'Cadeira disponível' });
  }
});


// Rota para fazer uma reserva
app.post('/reservas', async (req, res) => {
  const { nome_cliente, num_cadeira, sessao, nome_filme } = req.body;

  try {
    // Verifica se já existe uma reserva para a mesma sessão e cadeira
    const reservaExistente = await Reserva.findOne({
      where: {
        sessao: sessao,
        num_cadeira: num_cadeira
      }
    });

    if (reservaExistente) {
      // Se já existe uma reserva para a mesma sessão e cadeira, retorna um erro 409 (conflito)
      res.status(409).json({ message: 'Cadeira já reservada' });
      return;
    }

    // Cria uma nova reserva
    const reserva = await Reserva.create({
      nome_cliente: nome_cliente,
      num_cadeira: num_cadeira,
      sessao: sessao,
      nome_filme: nome_filme
    });

    // Retorna a reserva criada
    res.status(201).json(reserva);
  } catch (error) {
    // Se ocorrer algum erro na criação da reserva, retorna um erro 500 (erro interno do servidor)
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar reserva' });
  }
});


// Rota para criar novos usuários
app.post('/usuarios', async (req, res) => {
  const { Nome, CPF, Email, data_nascimento, Senha, Genero } = req.body;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(Senha)) {
    return res.status(400).json({ message: 'A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, letras minúsculas, números e caracteres especiais.' });
  }

  try {
    // Verifica se o CPF ou o Email já estão em uso
    const existingUser = await Usuarios.findOne({
      where: {
        [Op.or]: [
          { CPF },
          { Email }
        ]
      }
    });

    if (existingUser) {
      // CPF ou Email já estão em uso
      return res.status(409).json({ message: 'CPF ou Email já estão em uso.' });
    }

    // Cria um novo usuário
    const usuario = await Usuarios.create({
      Nome,
      CPF,
      Email,
      data_nascimento,
      Senha,
      Genero
    });

    // Retorna o usuário criado
    res.status(201).json(usuario);
  } catch (error) {
    // Se ocorrer algum erro na criação do usuário, retorna um erro 500 (erro interno do servidor)
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});



// Rota para fazer login
app.post('/login', async (req, res) => {
  const { Email, Senha } = req.body;

  try {
    // Busca pelo usuário com o CPF e senha informados
    const usuario = await Usuarios.findOne({
      where: {
        Email,
        Senha
      }
    });

    if (usuario) {
      // Se o usuário existe, retorna um status 200 (OK) com as informações do usuário
      res.status(200).json({message: 'Logado com Sucesso'});
    } else {
      // Se o usuário não existe ou as credenciais estão incorretas, retorna um erro 401 (não autorizado)
      res.status(401).json({ message: 'CPF ou senha inválidos' });
    }
  } catch (error) {
    // Se ocorrer algum erro na busca pelo usuário, retorna um erro 500 (erro interno do servidor)
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});


// Inicialização do servidor na porta 3000
app.listen(3012, () => {
  console.log('Servidor iniciado na porta 3000');
});
