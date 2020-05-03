"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = __importDefault(require("../clases/server"));
const mensajesRoutes = express_1.Router();
mensajesRoutes.post('/publico', (req, res) => {
    server_1.default.instance.io.emit('mensaje-nuevo', { de: req.body._id, cuerpo: req.body.cuerpo });
    res.json({
        de: req.body._id,
        cuerpo: req.body.cuerpo
    });
});
exports.default = mensajesRoutes;
