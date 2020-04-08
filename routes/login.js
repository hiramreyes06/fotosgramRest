"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginRoutes = express_1.Router();
loginRoutes.get(`/obtener`, (req, res) => {
    res.json({
        ok: true,
        message: "Usuarios bien"
    });
});
exports.default = loginRoutes;
