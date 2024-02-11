let sequelize = require('../database');

let Sequelize = require('sequelize');

let Expense = sequelize.define('expense',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Expense;