"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
let leer_convertir_usuarios = async () => {
    const PATH_USU = "\\home\\usuarios\\";
    let objetosUsuario = [];
    let archivos = await promises_1.default.readdir(PATH_USU);
    for (let i = 1; i < 10; i++) {
        let unArchivo = archivos[i];
        let strContenido = await promises_1.default.readFile(PATH_USU + unArchivo, "utf-8");
        objetosUsuario.push(JSON.parse(strContenido));
    }
    let nombres = objetosUsuario.map(z => { return { "nombre": z.firstName, "ciudad": z.city }; });
    console.log(nombres);
};
leer_convertir_usuarios();
