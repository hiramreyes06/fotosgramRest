"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const socket_1 = require("../clases/socket");
const autenticacion_1 = require("../middlewares/autenticacion");
const mapaRoutes = express_1.Router();
mapaRoutes.get('/marcadores', autenticacion_1.verificarToken, (req, res) => {
    res.json(socket_1.mapa.getMarcadores());
});
exports.default = mapaRoutes;
