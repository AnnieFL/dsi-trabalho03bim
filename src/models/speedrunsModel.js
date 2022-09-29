const { DataTypes, Model } = require('sequelize');
const { UsuariosModel } = require('../models/usuariosModel');
const { JogosModel } = require('../models/jogosModel');
const { sequelizeCon } = require('../config/db-config');

class SpeedrunsModel extends Model {}
    
SpeedrunsModel.init({
    categoria: DataTypes.INTEGER,
    tempo: DataTypes.TIME
}, { 
    sequelize: sequelizeCon, 
    schema: 'speedrunning',
    modelName: 'speedruns'
});

UsuariosModel.belongsToMany(JogosModel, { through: 'moderadoresJogos' });
JogosModel.belongsToMany(UsuariosModel, { through: 'moderadoresJogos' });

SpeedrunsModel.belongsTo(UsuariosModel, {
    foreignKey: 'runner'
});

SpeedrunsModel.belongsTo(JogosModel, {
    foreignKey: 'jogoId'
});

sequelizeCon.sync();


module.exports = { SpeedrunsModel };