const { JogosModel } = require('../models/jogosModel');
const { moderadoresJogosModel } = require('../models/moderadoresJogos');
const Util = require('../classes/util');
const { SpeedrunsModel } = require('../models/speedrunsModel');
const { UsuariosModel } = require('../models/usuariosModel');

class JogosController {

    constructor() {
        
    }

    async cria(req, res) {
        const error = await Util.validate([
            { valor: req.body.nome, nome: "nome" },
            { valor: req.body.lancamento, nome: "lancamento" },
            { valor: req.body.plataformas, nome: "plataformas" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const { nome, lancamento, plataformas } = req.body;

        let {categorias} = req.body;
        if (categorias) {
            categorias = categorias.map((e, i) => ({id: i, nome: e})); 
        }

        const jogo = await JogosModel.create({
            nome, lancamento, plataformas, categorias
        });

        return res.json(jogo);

    }

    async lista(req, res) {
        const jogos = await JogosModel.findAll();

        const lista = jogos.map((e) => ({id: e.id, nome: e.nome, plataformas: e.plataformas}))

        return res.json({jogos: lista});
    }

    async detalha(req, res) {
        const error = await Util.validate([
            { valor: req.params.id, nome: "id" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const {id} = req.params;

        const jogo = await JogosModel.findOne({
            where: {
                id
            }
        });

        const speedruns = await SpeedrunsModel.findAll({
            where: {
                jogoId: id
            }
        })

        const moderadores = await moderadoresJogosModel.findAll({
            where: {
                jogoId: id
            }
        })

        const usuarios = await UsuariosModel.findAll({
            where: {
                email: moderadores.map((e) => e.usuarioEmail)
            }
        })

        return res.json({ jogo: {jogo, speedruns, moderadores: usuarios} });
    }

    async speedruns(req, res) {
        const error = await Util.validate([
            { valor: req.body.id, nome: "id" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const {id} = req.body;

        const allSpeedruns = await SpeedrunsModel.findAll({
            where: {
                jogoId: id
            },
            include: [UsuariosModel, JogosModel]
        })

        if (!allSpeedruns) {
            return res.json({ msg: "Nenhuma run encontrada" })
        }

        const speedruns = allSpeedruns.map((speedrun) => ({
            tempo: speedrun.tempo,
            runner: speedrun.usuario.nome,
            categoria: speedrun.jogo.categorias.find((e) => e.id == speedrun.categoria).nome
        }));

        return res.json({ speedruns });
    }

    async moderadores(req, res) {
        const error = await Util.validate([
            { valor: req.body.id, nome: "id" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const {id} = req.body;

        const allModeradores = await moderadoresJogosModel.findAll({
            where: {
                jogoId: id
            }
        })

        const usuarios = await UsuariosModel.findAll({
            where: {
                email: allModeradores.map((e) => e.usuarioEmail)
            }
        })

        return res.json({ usuarios });
    }

    async altera(req, res) {
        let error = await Util.validate([
            { valor: req.body.nome, nome: "nome" },
            { valor: req.body.lancamento, nome: "lancamento" },
            { valor: req.body.plataformas, nome: "plataformas" }
        ], "OR")

        if (error) {
            return res.json({ msg: error });
        }

        error = await Util.validate([
            { valor: req.params.id, nome: "id" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        } 

        const {id} = req.params;

        const jogo = await JogosModel.findOne({
            where: {id}
        });

        const nome = req.body.nome ? req.body.nome : jogo.nome;
        const lancamento = req.body.lancamento ? req.body.lancamento : jogo.lancamento;
        const plataformas = req.body.plataformas ? req.body.plataformas : jogo.plataformas;

        newJogo = await JogosModel.update({nome, lancamento, plataformas}, {
            where: {id}
        });

        return res.status(201).json({ jogo: newJogo })

    }

    async deleta(req, res) {
        const error = await Util.validate([
            { valor: req.params.id, nome: "id" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const {id} = req.params;

        const jogo = await JogosModel.findOne({
            where: {
                id
            }
        })

        if (!jogo) {
            return res.json({ msg: "Jogo não encontrado" });
        }

        await moderadoresJogosModel.destroy({
            where: {
                jogoId: id
            }
        })

        await JogosModel.destroy({
            where: {
                id
            }
        })

        return res.status(201).json();

    }

    async adicionaCategoria(req, res) {
        const error = await Util.validate([
            { valor: req.params.id, nome: "id" },
            { valor: req.body.categorias, nome: "categorias" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const { id } = req.params;

        const jogo = await JogosModel.findOne({
            where: {
                id
            }
        })

        if (!jogo) {
            return res.json({msg: "Jogo não encontrado"});
        }

        let ultimaCategoria = jogo.categorias[jogo.categorias.length - 1] ? jogo.categorias[jogo.categorias.length - 1].id : 0;

        const categorias = jogo.categorias.concat(req.body.categorias).map((e) => {
            if (e.id) {
                return ({id: e.id, nome: e.nome});
            } else {
                ultimaCategoria++;
                return ({id: ultimaCategoria, nome: e});
            }
        })

        await JogosModel.update({categorias}, {
            where: {id}
        })

        return res.status(201).json()
    }

    async alteraCategoria(req, res) {
        const error = await Util.validate([
            { valor: req.params.id, nome: "id" },
            { valor: req.params.categoriaId, nome: "categoriaId" },
            { valor: req.body.nome, nome: "nome" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const { id, categoriaId } = req.params;
        const {nome} = req.body

        const jogo = await JogosModel.findOne({
            where: {
                id
            }
        })

        if (!jogo) {
            return res.json({ msg: "Jogo não encontrado" });
        } else if (!jogo.categorias.find((e) => e.id == categoriaId)) {
            return res.json({ msg: "Categoria não encontrada" });
        }

        const categorias = jogo.categorias.map((e) => {
            if (e.id == categoriaId) {
                return ({ id: e.id, nome });
            } else {
                return ({ id: e.id, nome: e.nome });
            }
        })

        newJogo = await JogosModel.update({ categorias }, {
            where: { id }
        })

        return res.status(201).json({jogo: newJogo})
    }

    async deletaCategoria(req, res) {
        const error = await Util.validate([
            { valor: req.params.id, nome: "id" },
            { valor: req.params.categoriaId, nome: "categoriaId" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const { id, categoriaId } = req.params;

        const jogo = await JogosModel.findOne({
            where: {
                id
            }
        })

        if (!jogo) {
            return res.json({ msg: "Jogo não encontrado" });
        } else if (!jogo.categorias.find((e) => e.id == categoriaId)) {
            return res.json({ msg: "Categoria não encontrada" });
        }

        const categorias = jogo.categorias.filter((e) => e.id != categoriaId);

        await SpeedrunsModel.destroy({
            where:{
                jogoId: id,
                categoria: categoriaId
            }
        })

        await JogosModel.update({ categorias }, {
            where: { id }
        })

        return res.status(201).json()

    }

}


module.exports = JogosController;