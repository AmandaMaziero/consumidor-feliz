'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(265)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(265)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      birthDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      cpf: {
        allowNull: false,
        type: Sequelize.STRING(11)
      },
      cell: {
        allowNull: false,
        type: Sequelize.STRING(11)
      },
      telephone: {
        type: Sequelize.STRING(11)
      },
      gender: {
        allowNull: false,
        comment: '0 - Outro/Prefiro não informar; 1 - Feminino; 2 - Masculino;',
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        comment: '1 - Cliente; 2 - Administrador;',
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: false,
        defaultValue: 1,
        comment: '0 - Inativo; 1 - Ativo;',
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};