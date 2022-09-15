const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class JogosModel extends Model {}
    
JogosModel.init({
    nome: DataTypes.STRING,
    lancamento: DataTypes.DATE,
    plataformas: DataTypes.ARRAY(DataTypes.STRING),
    categorias: DataTypes.ARRAY(DataTypes.JSON)
}, { 
    sequelize: sequelizeCon, 
    schema: 'speedrunning',
    modelName: 'jogos'
});


module.exports = { JogosModel };