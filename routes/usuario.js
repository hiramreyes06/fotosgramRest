"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Usuario_1 = require("../models/Usuario");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = __importDefault(require("../clases/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const environment_1 = require("../global/environment");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(environment_1.CLIENT_ID);
const usuarioRoutes = express_1.Router();
usuarioRoutes.post('/google', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userToken = req.get('x-token');
    const usuarioGoogle = yield verify(userToken)
        .catch(err => {
        res.status(404).json({
            ok: false,
            message: 'Token de google no valido'
        });
    });
    Usuario_1.Usuario.findOne({ email: usuarioGoogle.email }, '-password', (err, usuarioBD) => {
        if (err) {
            return res.json({
                ok: false,
                message: 'Error con el usuario'
            });
        }
        if (usuarioBD) {
            if (usuarioBD.google === false) {
                return res.status(401).json({
                    ok: false,
                    message: 'Ya estas registrado, necesitas iniciar sesion'
                });
            }
            else {
                const tokenUser = token_1.default.crearJwToken({
                    _id: usuarioBD._id,
                    nombre: usuarioBD.nombre,
                    email: usuarioBD.email,
                    role: usuarioBD.role
                });
                res.json({
                    ok: true,
                    message: 'El usuario ya estaba registrado, google token valido',
                    usuario: usuarioBD,
                    tokenUser
                });
            }
        }
        else {
            const usuario = {
                nombre: usuarioGoogle.name,
                avatar: usuarioGoogle.picture,
                email: usuarioGoogle.email,
                role: 'usuario',
                google: true,
                password: ':)'
            };
            Usuario_1.Usuario.create(usuario).then(usuarioRegistrado => {
                const tokenUser = token_1.default.crearJwToken({
                    _id: usuarioRegistrado._id,
                    nombre: usuarioRegistrado.nombre,
                    email: usuarioRegistrado.email,
                    role: usuarioRegistrado.role
                });
                delete usuarioRegistrado.password;
                res.json({
                    ok: true,
                    usuario: usuarioRegistrado,
                    tokenUser
                });
            }).catch(err => {
                res.status(404).json({
                    ok: false,
                    message: 'No se puedo registrar con google',
                    err
                });
            });
        }
    });
}));
function verify(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: environment_1.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    });
}
usuarioRoutes.get('/pagina', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip *= 10;
    yield Usuario_1.Usuario.find({}, '-password')
        .limit(10)
        .sort({ _id: -1 })
        .skip(skip)
        .exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al buscar usuarios'
            });
        }
        res.json({
            ok: true,
            usuarios
        });
    });
}));
usuarioRoutes.get('/termino', [autenticacion_1.verificarToken, autenticacion_1.adminRole], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const termino = new RegExp(req.query.termino, 'i');
    yield Usuario_1.Usuario.find({ nombre: termino }, '-password')
        .limit(10)
        .exec((err, usuarios) => {
        if (err)
            throw err;
        if (!usuarios) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontro el usuario'
            });
        }
        res.json({
            ok: true,
            usuarios
        });
    });
}));
usuarioRoutes.get('/nmUsuarios', autenticacion_1.verificarToken, (req, res) => {
    Usuario_1.Usuario.countDocuments({}, (err, nmUsuarios) => {
        if (err)
            throw err;
        return res.json({
            ok: true,
            nmUsuarios
        });
    });
});
usuarioRoutes.post(`/login`, (req, res) => {
    const body = req.body;
    Usuario_1.Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err)
            throw new err;
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario/contraseña no encontrada'
            });
        }
        if ((body.password) && usuarioBD.compararPassword(body.password)) {
            const token = token_1.default.crearJwToken({
                _id: usuarioBD._id,
                nombre: usuarioBD.nombre,
                email: usuarioBD.email,
                role: usuarioBD.role
            });
            res.json({
                ok: true,
                usuario: {
                    avatar: usuarioBD.avatar,
                    role: usuarioBD.role,
                    google: usuarioBD.google,
                    _id: usuarioBD._id,
                    nombre: usuarioBD.nombre,
                    email: usuarioBD.email
                },
                token
            });
        }
        else {
            res.status(400).json({
                ok: false,
                message: 'usuario/Contraseña no son correctos'
            });
        }
    });
});
usuarioRoutes.put(`/actualizar`, autenticacion_1.verificarToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    Usuario_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userActualizado) => {
        if (err)
            throw err;
        if (!userActualizado) {
            return res.json({
                ok: false,
                message: 'No existe el usuario con el id'
            });
        }
        const tokenUser = token_1.default.crearJwToken({
            _id: userActualizado._id,
            nombre: userActualizado.nombre,
            email: userActualizado.email,
            role: userActualizado.role
        });
        res.json({
            ok: true,
            userActualizado,
            tokenUser
        });
    });
});
usuarioRoutes.post(`/crear`, (req, res) => {
    const usuario = {
        nombre: req.body.nombre,
        avatar: req.body.avatar || 'sinFoto',
        email: req.body.email,
        role: req.body.role,
        password: bcryptjs_1.default.hashSync(req.body.password, 10)
    };
    Usuario_1.Usuario.create(usuario).then(usuarioRegistrado => {
        delete usuarioRegistrado['password'];
        res.json({
            ok: true,
            usuarioRegistrado
        });
    }).catch(err => {
        res.json({
            ok: false,
            message: 'No se pudo registrar al usuario',
            err
        });
    });
});
usuarioRoutes.get(`/token`, autenticacion_1.verificarToken, (req, res) => {
    res.json({
        ok: true,
        token: req.usuario
    });
});
exports.default = usuarioRoutes;
