const { UsuariosModel } = require('../models/usuariosModel');
const { JogosModel } = require('../models/jogosModel');
const Util = require('../classes/util');
const jwt = require('jsonwebtoken');

class UsuariosController {

    constructor() {
        
    }

    async signIn(req, res) {
        const { nome } = req.body;
        const email = req.body.email.toLowerCase();
        let senha = await Util.encrypt(req.body.senha);

        const user = await UsuariosModel.create({
            email, senha, nome
        });

        return res.status(201).json(user);

    }

    async moderar(req, res) {
        const email = req.body.email.toLowerCase();
        const {jogos} = req.body
        const error = [];

        const user = await UsuariosModel.findOne({
            where: {
                email
            }
        })

        if (!user) {
            return res.json({error: 'Usuário não encontrado'});
        }

        jogos.map(async (jogo) => {
            const exist = await JogosModel.findOne({
                where: {
                    id: jogo
                }
            })

            if (exist) {
                error.push(`jogo ${jogo} não encontrado`)
            } else {
                await user.addJogos(exist)
            }
        }) 
        
        if (error[0]) {
            return res.json({error: error.join(',')})
        } else {
            return res.status(201).json({});
        }
    }

    async logIn(req, res) {
        const email = req.body.email.toLowerCase() 
        const { senha } = req.body;

        const user = await UsuariosModel.findOne({
            where: {
                email
            }
        });

        const match = await Util.compare(senha, user.senha);

        if (!match) {
            return res.status(400).json({ msg: "Usuario e senha não se encaixam!"});
        }
        const token = jwt.sign(user.dataValues, 'Seria muito engracado se eu fizesse a secret hardcoded ha ha')
        return res.json(token);
    }
}


module.exports = UsuariosController;