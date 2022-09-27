const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const usuariosRouter = Router();
const UsuariosController = require('../controllers/usuariosController');


const usuariosController = new UsuariosController();


usuariosRouter.get('/', (req, res) => usuariosController.lista(req, res));
usuariosRouter.get('/moderados', (req, res) => usuariosController.moderados(req, res));
usuariosRouter.get('/speedruns', (req, res) => usuariosController.speedruns(req, res));
usuariosRouter.get('/:email', (req, res) => usuariosController.detalha(req, res));

usuariosRouter.post('/', (req, res) => usuariosController.signIn(req, res));
usuariosRouter.post('/moderar', isAuth, (req, res) => usuariosController.moderar(req, res));
usuariosRouter.post('/log', (req, res) => usuariosController.logIn(req, res));

usuariosRouter.put('/:email', isAuth, (req, res) => usuariosController.altera(req, res));

usuariosRouter.delete('/:email', isAuth, (req, res) => usuariosController.deleta(req, res));
usuariosRouter.delete('/desmoderar/:email', isAuth, (req, res) => usuariosController.desmoderar(req, res));


module.exports = usuariosRouter;