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
const autenticacion_1 = require("../middlewares/autenticacion");
const Post_1 = require("../models/Post");
const file_system_1 = __importDefault(require("../clases/file-system"));
const fileSystem = new file_system_1.default();
const postRoutes = express_1.Router();
postRoutes.get('/busqueda', (req, res) => {
    const titulo = new RegExp(req.query.titulo, 'i');
    Post_1.Post.findOne({ titulo: titulo }).populate('usuario', '-password')
        .exec().then(post => {
        if (!post) {
            res.status(404).json({
                existe: false,
                message: 'El post no fue encontrado'
            });
        }
        else {
            res.json(post);
        }
    }).catch(err => res.status(400).json(err));
});
postRoutes.get(`/pagina`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip *= 10;
    yield Post_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec((err, posts) => {
        if (err)
            throw err;
        if (!posts) {
            return res.json({
                ok: false,
                message: 'No existen posts',
                posts: []
            });
        }
        res.json({
            ok: true,
            posts,
            pagina
        });
    });
}));
postRoutes.get(`/imagen/:userid/:img`, autenticacion_1.verificarToken, (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    res.sendFile(fileSystem.getFotoUrl(userId, img));
});
postRoutes.get(`/:id`, (req, res) => {
    const id = req.params.id;
    Post_1.Post.findById(id, (err, post) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        if (!post) {
            return res.json({
                ok: false,
                message: 'Post no encontrado'
            });
        }
        yield post.populate('usuario', '-password').execPopulate();
        res.json(post);
    }));
});
postRoutes.post('/crear', autenticacion_1.verificarToken, (req, res) => {
    let multimedia;
    if (req.body.multimedia) {
        multimedia = JSON.parse(req.body.multimedia);
    }
    else {
        multimedia = [];
    }
    const post = {
        fecha: new Date(),
        titulo: req.body.titulo,
        texto: req.body.texto,
        coords: {
            lng: req.body.coords.lng,
            lat: req.body.coords.lat
        },
        multimedia,
        usuario: req.usuario._id
    };
    Post_1.Post.create(post).then(post => {
        res.json({
            ok: true,
            post
        });
    })
        .catch(err => res.status(400).json({ ok: false,
        message: 'Error al crear post',
        err }));
});
postRoutes.post(`/crearTemp`, autenticacion_1.verificarToken, (req, res) => {
    const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
    const post = {
        titulo: req.body.titulo,
        texto: req.body.texto,
        coords: req.body.coords,
        imgs: imagenes,
        usuario: req.usuario._id
    };
    Post_1.Post.create(post).then((postCreado) => __awaiter(void 0, void 0, void 0, function* () {
        yield postCreado.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            postCreado
        });
    })).catch(err => {
        console.log(err);
        res.json({
            ok: false,
            message: 'No se pudo crear post'
        });
    });
});
postRoutes.post(`/upload`, autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No se recibio el archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: true,
            message: 'El archivo no tiene el key image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: true,
            message: 'El archivo no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
exports.default = postRoutes;
