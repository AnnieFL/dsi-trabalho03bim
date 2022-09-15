const { Sequelize } = require('sequelize');

const sequelizeCon = new Sequelize('postgres://vjjhzyaefnvkyk:fa08e6744de37e017bb8147067257f619e54100fe0b126187d50edb660ac2fc4@ec2-44-207-133-100.compute-1.amazonaws.com:5432/d86s1to44c3nim', {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

module.exports = { sequelizeCon };