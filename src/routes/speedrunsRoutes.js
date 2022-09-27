const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const speedrunsRouter = Router();
const SpeedrunsController = require('../controllers/speedrunsController');


const speedrunsController = new SpeedrunsController();

speedrunsRouter.get('/:id', (req, res) => speedrunsController.detalha(req, res));

speedrunsRouter.post('/', isAuth, (req, res) => speedrunsController.cria(req, res));

speedrunsRouter.put('/:id', isAuth, (req, res) => speedrunsController.altera(req, res));

speedrunsRouter.delete('/:id', isAuth, (req, res) => speedrunsController.deleta(req, res));


module.exports = speedrunsRouter;