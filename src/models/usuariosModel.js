const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class UsuariosModel extends Model {}
    
UsuariosModel.init({
    email: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    nome: DataTypes.STRING,
    senha: DataTypes.STRING
}, { 
    sequelize: sequelizeCon, 
    schema: 'speedrunning',
    modelName: 'usuarios'
});


module.exports = { UsuariosModel };