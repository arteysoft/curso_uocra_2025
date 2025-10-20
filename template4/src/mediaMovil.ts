let promediar:(xs:Array<number>)=>number = (xs)=> {
    return Math.round(xs.reduce((a,b)=> a + b, 0) / xs.length)
}

let generarMediaMovil:(xs:Array<number>)=>number = (xs) => {
    if (xs.length == 0) {
        throw new Error("generarMediaMovil::El parametro no puede ser un array vacio")
    }
    if (xs.length == 1) {
        return xs[0]
    }
    if (xs.length < 200) {
        return promediar(xs)
    }
    // Si no entro hasta ahora entonces es mayor a 200
    let ultimos200 = xs.slice(-200)
    console.log("solo tomo los ultimos 200")
    return promediar(ultimos200)
}


console.log(generarMediaMovil([4, 5, 10, 11, 4, 5, 10, 11]))
