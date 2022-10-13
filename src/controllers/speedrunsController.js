const { JogosModel } = require('../models/jogosModel');
const Util = require('../classes/util');
const { SpeedrunsModel } = require('../models/speedrunsModel');
const { UsuariosModel } = require('../models/usuariosModel');

class SpeedrunsController {

    constructor() {
        
    }

    async cria(req, res) {
        const error = await Util.validate([
            { valor: req.body.runner, nome: "runner", tipo: "string" },
            { valor: req.body.tempo, nome: "tempo", tipo: "string" },
            { valor: req.body.jogoId, nome: "jogoId", tipo: "integer" },
            { valor: req.body.categoria, nome: "categoria", tipo: "integer" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const runner = req.body.runner.toLowerCase();
        const { categoria, tempo, jogoId } = req.body;
        let categoriaCheck = true;
        
        const jogo = await JogosModel.findOne({
            where: {id: jogoId}
        })

        const user = await UsuariosModel.findOne({
            where: {email: runner}
        })

        if (jogo) {
            categoriaCheck = jogo.categorias.find((e) => e.id == categoria);
        }

        if (jogo && user && categoriaCheck) {
            const speedrun = await SpeedrunsModel.create({
                runner, categoria, tempo, jogoId
            })
            
            return res.status(201).json(speedrun);
        } else {
            const msg = [!jogo ? "Jogo não encontrado" : false, !user ? "Usuário não encontrado" : false, !categoriaCheck ? "Categoria não encontrada" : false]
            return res.status(400).json(msg.filter((e) => e).join('; '))
        }

    }

    async detalha(req, res) {
        const {id} = req.params;

        const speedrun = await SpeedrunsModel.findOne({
            where: {id: id},
            include: [UsuariosModel, JogosModel]
        });

        return res.json({
            tempo: speedrun.tempo, 
            runner: speedrun.usuario.nome, 
            jogo: speedrun.jogo.nome, 
            categoria: speedrun.jogo.categorias.find((e) => e.id == speedrun.categoria).nome
        });
    }

    async altera(req, res) {
        let error = await Util.validate([
            { valor: req.body.tempo, nome: "tempo", tipo: "string" },
            { valor: req.body.categoria, nome: "categoria", tipo: "integer" }
        ], "OR")

        if (error) {
            return res.json({ msg: error });
        }

        error = await Util.validate([
            { valor: req.params.id, nome: "id", tipo: "integer" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        } 

        const {id} = req.params;

        const speedrun = await SpeedrunsModel.findOne({
            where: {id}
        })

        if (!speedrun) {
            return res.json({msg: "Speedrun não encontrada"});
        }

        const tempo = req.body.tempo ? req.body.tempo : speedrun.tempo;
        const categoria = req.body.categoria ? req.body.categoria : speedrun.categoria;

        const newSpeedrun = await SpeedrunsModel.update({tempo, categoria}, {
            where: {
                id
            }
        })

        return res.status(201).json({speedrun: newSpeedrun});
    }

    async deleta(req, res) {
        const error = await Util.validate([
            { valor: req.params.id, nome: "id", tipo: "integer" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const { id } = req.params;

        const speedrun = await JogosModel.findOne({
            where: {
                id
            }
        })

        if (!speedrun) {
            return res.json({ msg: "Speedrun não encontrada" });
        }

        await SpeedrunsModel.destroy({
            where: { id }
        })

        return res.status(201).json();
    }

}


module.exports = SpeedrunsController;