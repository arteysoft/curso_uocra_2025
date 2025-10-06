"use strict";
let input = ["limon", "melon", "limon", "sandia", "melon", "sandia", "limon"];
let output = [];
output = input.sort((a, b) => {
    if ((a == "limon") && (b == "melon"))
        return -1;
    if ((a == "limon") && (b == "sandia"))
        return -1;
    if ((a == "melon") && (b == "sandia"))
        return -1;
    return 1;
});
console.log(output);
