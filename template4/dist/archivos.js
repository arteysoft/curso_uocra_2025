"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generarusuario_1 = __importDefault(require("./generarusuario"));
const promises_1 = __importDefault(require("fs/promises"));
let crearArchivoDeUsuarioFake = async () => {
    let objUsuario = (0, generarusuario_1.default)();
    let strObjUsuario = JSON.stringify(objUsuario);
    let arrPathArchivo = [];
    arrPathArchivo.push("\\home");
    arrPathArchivo.push("\\andy");
    arrPathArchivo.push("\\usuarios\\");
    arrPathArchivo.push(objUsuario.id);
    arrPathArchivo.push(".json");
    let strNombreArchivoCompleto = arrPathArchivo.join('');
    await promises_1.default.writeFile(strNombreArchivoCompleto, strObjUsuario, "utf-8");
};
let leer_convertir_usuarios = async () => {
    const PATH_USU = "\\home\\usuarios\\";
    let saldos = [];
    let archivos = await promises_1.default.readdir(PATH_USU);
    for (let i = 1; i < await archivos.length; i++) {
        let unArchivo = archivos[i];
        let contenido = await promises_1.default.readFile(PATH_USU + unArchivo, "utf-8");
        let objUsu = JSON.parse(contenido);
        saldos.push(parseFloat(objUsu.amount));
    }
    console.log(saldos);
};
leer_convertir_usuarios();
