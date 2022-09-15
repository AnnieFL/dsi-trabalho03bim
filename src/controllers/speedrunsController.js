const { SpeedrunsModel } = require('../models/speedrunsModel');

class SpeedrunsController {

    constructor() {
        
    }

    async create(req, res) {
        const { email, senha, nome } = req.body;

        const user = await Usuario.create({
            email, senha, nome
        });

        return res.status(201).json(user);
    }

}


module.exports = SpeedrunsController;