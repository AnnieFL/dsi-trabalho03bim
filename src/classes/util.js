
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
            const error = array.find((e) => !e.valor)
    
            if (error) {
                return `${error.nome} não encontrado`
            }
        } else if (method == "OR") {
            const error = array.filter((e) => !e.valor);

            if (error.length == array.length) {
                return `Nenhum dado recebido`
            }
        }
    }
}

module.exports = Util;