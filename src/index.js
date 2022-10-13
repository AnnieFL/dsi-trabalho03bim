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