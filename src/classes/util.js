
const bcrypt = require('bcryptjs')

class Util {

    static async encrypt(senha) {
        try {
            const hash = await bcrypt.hash(senha, 10);
            return hash;
        } catch (err) {
            return console.log(err);
        }  
    }

    static async compare(senha, hash) {
        try {
            const res = await bcrypt.compare(senha, hash);
            return res;
        } catch (err) {
            return console.log(err);
        }
    }

    static async validate(array, method) {
        if (method == "AND") {
            const error = array.find((e) => {
                if (!e.valor) {
                    return true;
                } else if (e.tipo == "integer") {
                    return e.valor != parseInt(e.valor)
                } else if (e.tipo == "array") {
                    return !Array.isArray(e.valor);
                } else {
                    return typeof e.valor != e.tipo 
                }
            })
    
            if (error) {
                return `${error.nome} não encontrado ou inválido`
            }
        } else if (method == "OR") {
            const error = array.filter((e) => {
                if (!e.valor) {
                    return true;
                }
            });

            const erroGrave = array.find((e) => {
                if (!e.valor) {
                    return false
                }
                if (e.tipo == "integer") {
                    return e.valor != parseInt(e.valor)
                } else if (e.tipo == "array") {
                    return !Array.isArray(e.valor);
                } else {
                    return typeof e.valor != e.tipo 
                }
            })

            if (erroGrave) {
                return `${erroGrave.nome} deve ser do tipo ${erroGrave.tipo}`
            } 

            if (error.length == array.length) {
                return `Nenhum dado recebido`
            }
        }
    }
}

module.exports = Util;