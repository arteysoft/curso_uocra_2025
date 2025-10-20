let fn6 = () => {
    console.log("LLEGUEEEEEE ")
}

let fn5 = () => {
    console.log("Antes de llamar a fn6")
    fn6()
    console.log("Despues de llamar a fn6")
}

let fn4 = () => {
    console.log("Antes de llamar a fn5")
    fn5()
    console.log("Despues de llamar a fn5")
}

let fn3 = () => {
    console.log("Antes de llamar a fn4")
    fn4()
    console.log("Despues de llamar a fn4")
}

let fn2 = () => {
    console.log("Antes de llamar a fn3")
    fn3()
    console.log("Despues de llamar a fn3")
}

let fn1 = () => {
    console.log("Antes de llamar a fn2")
    fn2()
    console.log("Despues de llamar a fn2")
}





fn1()