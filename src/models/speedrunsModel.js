const { DataTypes, Model } = require('sequelize');
const { UsuariosModel } = require('../models/usuariosModel');
const { JogosModel } = require('../models/jogosModel');
const { moderadoresJogosModel } = require('../models/moderadoresJogos');
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

moderadoresJogosModel.belongsTo(UsuariosModel, {
    foreignKey: 'usuarioEmail',
    onDelete: 'CASCADE'
});

moderadoresJogosModel.belongsTo(JogosModel, {
    foreignKey: 'jogoId',
    onDelete: 'CASCADE'
})

SpeedrunsModel.belongsTo(UsuariosModel, {
    foreignKey: 'runner',
    onDelete: 'CASCADE'
});

SpeedrunsModel.belongsTo(JogosModel, {
    foreignKey: 'jogoId',
    onDelete: 'CASCADE'
});

sequelizeCon.sync();


module.exports = { SpeedrunsModel };