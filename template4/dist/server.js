"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require('path');
let app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path.join(__dirname, '../public')));
app.get("/hola", (req, res) => {
    res.send("hola").end();
});
app.listen(3000, () => {
    console.log('escuchando puerto 3000');
});
