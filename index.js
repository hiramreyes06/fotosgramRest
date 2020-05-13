"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const environment_1 = require("./global/environment");
const cors_1 = __importDefault(require("cors"));
const express_1 = require("express");
const usuario_1 = __importDefault(require("./routes/usuario"));
const Post_1 = __importDefault(require("./routes/Post"));
const mensajes_1 = __importDefault(require("./routes/mensajes"));
const mapa_1 = __importDefault(require("./routes/mapa"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const prueba = express_1.Router();
const server = server_1.default.instance;
const corsOptions = {
    methods: ['GET', 'PUT', 'DELETE', 'POST'],
    credentials: true,
    origin: true
};
server.app.use(cors_1.default(corsOptions));
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
server.app.use(express_fileupload_1.default({
    useTempFiles: true
}));
server.app.use(`/usuario`, usuario_1.default);
server.app.use(`/post`, Post_1.default);
server.app.use('/mensajes', mensajes_1.default);
server.app.use('/mapa', mapa_1.default);
mongoose_1.default.connect(process.env.URLDB, { useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos online');
});
prueba.get(`/`, (req, res) => {
    res.json({
        ok: true,
        message: "Rest esta bien"
    });
});
server.app.use(prueba);
server.start(() => {
    console.log(`Escuchando el puerto: ${environment_1.SERVER_PORT}`);
});
