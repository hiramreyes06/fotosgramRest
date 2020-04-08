"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../clases/token"));
exports.verificarToken = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.validarToken(userToken).then((decoded) => {
        req.usuario = decoded.usuario;
        next();
    }).catch(err => {
        res.json({
            ok: false,
            message: 'Token no valido',
            err
        });
    });
};
exports.adminRole = (req, res, next) => {
    if (req.usuario.role === "admin") {
        next();
    }
    else {
        res.status(401).json({
            ok: false,
            message: 'Solo admins pueden hacerlo'
        });
    }
};
