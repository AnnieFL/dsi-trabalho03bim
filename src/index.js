const express = require('express');
const app = express();


app.use(express.json());


const jogosRouter = require('./routes/jogosRoutes');
app.use('/jogo', jogosRouter);

const usuariosRouter = require('./routes/usuariosRoutes');
app.use('/usuario', usuariosRouter);

const speedrunsRouter = require('./routes/speedrunsRoutes');
app.use('/speedrun', speedrunsRouter);

app.listen(3000, () => console.log("Listening at 3000"));

/*
{
    "nome": "asd",
    "email": "asd",
    "senha": "asd",
}

{
    "nome": "bla",
    "senha": "bla"
}

{
    "nome": "asd",
    "lancamento": "2022-09-26",
    "plataformas": ["asd","dsa"],
    "categorias": [
        {"id": 1, "nome": "any%"},
        {"id": 2, "nome": "100%"},
    ]
}

{
    "email": "asd",
    "jogos": [1]
}

{
    "categoria": 1,
    "jogoId": 1,
    "runner": "asd"
}
*/