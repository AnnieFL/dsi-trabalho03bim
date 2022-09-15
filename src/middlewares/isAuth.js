const jwt = require('jsonwebtoken')

const isAuth  = (req, res, next) => {
    
    // verifica se token existe
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({msg:  "missing authorization token"}); 
    }

    // validar o token
    const tokenValidado = jwt.verify(token, "Seria muito engracado se eu fizesse a secret hardcoded ha ha");
    console.log({ tokenValidado })

    req.user = tokenValidado;
    next();
}

module.exports = { isAuth };