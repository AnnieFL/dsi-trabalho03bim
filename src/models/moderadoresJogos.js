const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class moderadoresJogosModel extends Model {}
    
moderadoresJogosModel.init({
}, { 
    sequelize: sequelizeCon, 
    schema: 'speedrunning',
    modelName: 'moderadoresJogos'
});


module.exports = { moderadoresJogosModel };