const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const router = Router();
const UsuariosController = require('../controllers/usuariosController');
const JogosController = require('../controllers/jogosController');
const SpeedrunsController = require('../controllers/speedrunsController');


const usuariosController = new UsuariosController();
const jogosController = new JogosController();
const speedrunsController = new SpeedrunsController();

router.post('/', (req, res) => usuariosController.signIn(req, res));
router.post('/moderar', isAuth, (req, res) => usuariosController.moderar(req, res));

router.get('/', (req, res) => usuariosController.logIn(req, res));


module.exports = router;