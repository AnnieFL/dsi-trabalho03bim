const { UsuariosModel } = require('../models/usuariosModel');
const { JogosModel } = require('../models/jogosModel');
const { moderadoresJogosModel } = require('../models/moderadoresJogos');
const Util = require('../classes/util');
const jwt = require('jsonwebtoken');
const { SpeedrunsModel } = require('../models/speedrunsModel');

class UsuariosController {

    constructor() {

    }

    async signIn(req, res) {
        const error = await Util.validate([
            { valor: req.body.email, nome: "email" },
            { valor: req.body.senha, nome: "senha" },
            { valor: req.body.nome, nome: "nome" },
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const { nome } = req.body;
        const email = req.body.email.toLowerCase();
        const senha = await Util.encrypt(req.body.senha);

        const user = await UsuariosModel.create({
            email, senha, nome
        });

        return res.status(201).json(user);

    }

    async lista(req, res) {
        const usuarios = await UsuariosModel.findAll();

        return res.json({ usuarios });
    }

    async moderar(req, res) {
        const error = await Util.validate([
            { valor: req.body.email, nome: "email" },
            { valor: req.body.jogos, nome: "jogos" },
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const email = req.body.email.toLowerCase();
        const { jogos } = req.body
        const msg = [];

        const user = await UsuariosModel.findOne({
            where: {
                email
            }
        })

        if (!user) {
            return res.json({ error: 'Usuário não encontrado' });
        }


        for (let i = 0; i < jogos.length; i++) {
            const jogo = jogos[i];


            const moderadores = await moderadoresJogosModel.findOne({
                where: {
                    jogoId: jogo,
                    usuarioEmail: email
                }
            })

            const exist = await JogosModel.findOne({
                where: {
                    id: jogo
                }
            })

            if (moderadores) {
                await msg.push(`${user.nome} já modera ${exist.nome}`)
            } else if (!exist) {
                await msg.push(`jogo ${jogo} não encontrado`);
            } else {
                await moderadoresJogosModel.create({
                    usuarioEmail: user.email,
                    jogoId: exist.id
                })

                await msg.push(`${user.nome} agora é moderador do jogo ${exist.nome}`);
            }
        }

        if (msg[0]) {
            return res.json({ msg: msg.join('; ') })
        } else {
            return res.status(201).json({});
        }
    }

    async logIn(req, res) {
        const error = await Util.validate([
            { valor: req.body.email, nome: "email" },
            { valor: req.body.senha, nome: "senha" },
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const email = req.body.email.toLowerCase()
        const { senha } = req.body;

        const user = await UsuariosModel.findOne({
            where: {
                email
            }
        });

        const match = await Util.compare(senha, user.senha);

        if (!match) {
            return res.status(400).json({ msg: "Usuario e senha não se encaixam!" });
        }
        const token = jwt.sign(user.dataValues, 'Seria muito engracado se eu fizesse a secret hardcoded ha ha')
        return res.json(token);
    }

    async detalha(req, res) {
        const error = await Util.validate([
            { valor: req.params.email, nome: "email" },
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }
        const email = req.params.email.toLowerCase()

        const user = await UsuariosModel.findOne({
            where: {
                email
            },
        });

        if (!user) {
            return res.json({msg: "Usuario não encontrado"});
        }

        const jogosModerados = await moderadoresJogosModel.findAll({
            where: {
                usuarioEmail: user.email
            }
        })

        const jogos = await JogosModel.findAll({
            where: {
                id: jogosModerados.map((e) => e.id)
            }
        })

        const speedruns = await SpeedrunsModel.findAll({
            where: {
                runner: email
            }
        })

        return res.json({ usuario: {user, jogosModerados: jogos, speedruns} });
    }

    async speedruns(req, res) {
        const error = await Util.validate([
            { valor: req.body.email, nome: "email" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const email = req.body.email.toLowerCase();

        const allSpeedruns = await SpeedrunsModel.findAll({
            where: {
                runner: email
            },
            include: [JogosModel]
        })

        if (!allSpeedruns) {
            return res.json({ msg: "Nenhuma run encontrada" })
        }

        const speedruns = allSpeedruns.map((speedrun) => ({
            tempo: speedrun.tempo,
            jogo: speedrun.jogo.nome,
            categoria: speedrun.jogo.categorias.find((e) => e.id == speedrun.categoria).nome
        }));

        return res.json({ speedruns });
    }

    async moderados(req, res) {
        const error = await Util.validate([
            { valor: req.body.email, nome: "email" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const email = req.body.email.toLowerCase();

        const allModerados = await moderadoresJogosModel.findAll({
            where: {
                usuarioEmail: email
            }
        })

        const jogos = await JogosModel.findAll({
            where: {
                id: allModerados.map((e) => e.jogoId)
            }
        })

        return res.json({ jogos });
    }

    async altera(req, res) {
        let error = await Util.validate([
            { valor: req.body.nome, nome: "nome" },
            { valor: req.body.senha, nome: "senha" },
        ], "OR")

        if (error) {
            return res.json({ msg: error });
        }

        error = await Util.validate([
            { valor: req.params.email, nome: "email" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const email = req.params.email.toLowerCase();

        const user = await UsuariosModel.findOne({
            where: { email }
        })

        let nome = req.body.nome ? req.body.nome : user.nome;
        let senha = req.body.senha ? await Util.encrypt(req.body.senha) : user.senha;

        const newUsuario = await UsuariosModel.update({ nome, senha }, {
            where: { email }
        })

        return res.status(201).json({ usuario: newUsuario });

    }

    async deleta(req, res) {
        const error = await Util.validate([
            { valor: req.params.email, nome: "email" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const email = req.params.email.toLowerCase();

        const user = await UsuariosModel.findOne({
            where: {
                email
            }
        })

        if (!user) {
            return res.json({ msg: "Usuário não encontrado" });
        }

        await moderadoresJogosModel.destroy({
            where: {
                usuarioEmail: email
            }
        })

        await UsuariosModel.destroy({
            where: {
                email
            }
        })

        return res.status(201).json();

    }

    async desmoderar(req, res) {
        const error = await Util.validate([
            { valor: req.params.email, nome: "email" }
        ], "AND")

        if (error) {
            return res.json({ msg: error });
        }

        const email = req.params.email.toLowerCase();

        await moderadoresJogosModel.destroy({
            where: {
                usuarioEmail: email
            }
        })

        return res.status(201).json();
    }
}


module.exports = UsuariosController;