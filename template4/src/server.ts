import express from 'express'
const path = require('path');

export let iniciarServidor = () => {
    let app = express()

    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../public')));

    app.get("/hola", (req, res) => {
        res.send("hola").end()
    })

    app.get("/datos", (req, res) => {

        let arrDatos = [
            ['Año', 'Ventas', 'Gastos'],
            ['2004',  8600,  6400],
            ['2005',  1170,   460],
            ['2006',   660,  1120],
            ['2007',  1030, 20000]
        ]

        let objDatos = {arrDatos:arrDatos}

        res.send(JSON.stringify(objDatos)).end();
    });

    app.listen(3000, () => {
        console.log('escuchando puerto 3000')
    })
} 

