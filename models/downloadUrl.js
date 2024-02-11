const sequelize = require('../database');
const Sequelize = require('sequelize');

const DownloadUrl = sequelize.define('downloadUrl',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url: {
        allowNull: false,
        type: Sequelize.STRING
    },
    filename: {
        allowNull: false,
        type: Sequelize.STRING
    }
});

module.exports = DownloadUrl