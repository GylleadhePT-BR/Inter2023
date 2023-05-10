const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('usuario', 'root', 'bfecac3de@881234', {
  host: 'localhost',
  dialect: 'mysql'
});

const Usuarios = sequelize.define('Usuarios', {
  Nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  CPF: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  Senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Genero: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Usuarios;
