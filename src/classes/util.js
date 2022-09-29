
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
}

module.exports = Util;