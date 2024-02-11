let sequelize = require('../database');

let Sequelize = require('sequelize');

let User = sequelize.define('user',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
        
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    isPremiumUser: Sequelize.BOOLEAN,
    total: {
        type: Sequelize.INTEGER
    }

    
});

module.exports = User;