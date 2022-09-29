const express = require('express');
const app = express();


app.use(express.json());


const router = require('./routes/routes');
app.use('/', router);

app.listen(3000, () => console.log("Listening at 3000"));