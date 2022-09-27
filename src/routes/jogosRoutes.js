const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const jogosRouter = Router();
const JogosController = require('../controllers/jogosController');


const jogosController = new JogosController();

jogosRouter.get('/', (req, res) => jogosController.lista(req, res));
jogosRouter.get('/moderadores', (req, res) => jogosController.moderadores(req, res));
jogosRouter.get('/speedruns', (req, res) => jogosController.speedruns(req, res));
jogosRouter.get('/:id', (req, res) => jogosController.detalha(req, res));

jogosRouter.post('/', isAuth, (req, res) => jogosController.cria(req, res));
jogosRouter.post('/:id', isAuth, (req, res) => jogosController.adicionaCategoria(req, res));

jogosRouter.put('/:id', isAuth, (req, res) => jogosController.altera(req, res))
jogosRouter.put('/:id/:categoriaId', isAuth, (req, res) => jogosController.alteraCategoria(req, res))

jogosRouter.delete('/:id', isAuth, (req, res) => jogosController.deleta(req, res))
jogosRouter.delete('/:id/:categoriaId', isAuth, (req, res) => jogosController.deletaCategoria(req, res))

module.exports = jogosRouter;