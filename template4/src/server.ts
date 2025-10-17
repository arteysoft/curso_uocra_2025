import express from 'express'
import fs from 'fs/promises'
const path = require('path');

export let iniciarServidor = () => {
    let app = express()

    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../public')));

    app.get("/hola", (req, res) => {
        res.send("hola").end()
    })

    app.get("/datos", async (req, res) => {

        let arrDatos:Array<any> = [
            ['Fecha', 'Cotizacion', 'media']
        ]

        const rutaArchivo = path.join(__dirname, '../../datos_mercado_libre.txt');
        let data = await fs.readFile(rutaArchivo, 'utf8')
        
        const lineas = data.trim().split('\r\n').reverse();
        for (let linea of lineas.map(linea => linea.split('\t'))) {
            arrDatos.push([linea[0], parseInt(linea[1]), parseInt(linea[1])+10000])
        }
        
        let objDatos = {arrDatos:arrDatos}

        res.send(JSON.stringify(objDatos)).end();
    });

    app.listen(3000, () => {
        console.log('escuchando puerto 3000')
    })
} 

