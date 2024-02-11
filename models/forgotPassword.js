let sequelize = require('../database');
let Sequelize = require('sequelize');

let Request = sequelize.define('request',{
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    isactive: {
        type: Sequelize.BOOLEAN
    } 
});

module.exports = Request;