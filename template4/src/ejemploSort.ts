let input:Array<String> = ["limon", "melon", "limon", "sandia", "melon", "sandia", "limon"]

let output:Array<String> = []

output = input.sort((a:String, b:String) => {
    if ((a == "limon") && (b == "melon"))  return -1
    if ((a == "limon") && (b == "sandia")) return -1
    if ((a == "melon") && (b == "sandia")) return -1
    
    return 1
})

console.log(output)
