import crearObjetoFake from "./generarusuario";
import fs from 'fs/promises'

type procedimientoSinParametros = ()=> void

let crearArchivoDeUsuarioFake:procedimientoSinParametros = async () => {
    let objUsuario = crearObjetoFake()
    let strObjUsuario = JSON.stringify(objUsuario)
    let arrPathArchivo:Array<string> = []

    arrPathArchivo.push("\\home")
    arrPathArchivo.push("\\andy")
    arrPathArchivo.push("\\usuarios\\")
    arrPathArchivo.push(objUsuario.id)
    arrPathArchivo.push(".json")

    let strNombreArchivoCompleto = arrPathArchivo.join('')

    await fs.writeFile(strNombreArchivoCompleto, strObjUsuario, "utf-8")
}

let leer_convertir_usuarios:procedimientoSinParametros = async () => {
    const PATH_USU = "\\home\\usuarios\\"
    let saldos:Array<number> = []
    let archivos = await fs.readdir(PATH_USU)
    for (let i = 1; i < await archivos.length; i++) {
        let unArchivo = archivos[i]
        let contenido = await fs.readFile(PATH_USU + unArchivo, "utf-8")
        let objUsu = JSON.parse(contenido)
        saldos.push(parseFloat(objUsu.amount))
    }
    console.log(saldos)
}

leer_convertir_usuarios()
