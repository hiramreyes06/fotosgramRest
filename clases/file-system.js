"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            const path = this.crearCarpetaUsuario(userId);
            const nombreArchivo = this.generarNombreUnico(file.name);
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve();
            });
        });
    }
    generarNombreUnico(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagenesDeTempHaciaPost(userId) {
        const pathUserTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathUserPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'post');
        if (!fs_1.default.existsSync(pathUserTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathUserPost)) {
            fs_1.default.mkdirSync(pathUserPost);
        }
        const imagenesTemp = this.obtenerImagnesEnTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathUserTemp}/${imagen}`, `${pathUserPost}/${imagen}`);
        });
        return imagenesTemp;
    }
    obtenerImagnesEnTemp(userId) {
        const pathUserPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathUserPost) || [];
    }
    getFotoUrl(usuarioId, img) {
        const pathUserImg = path_1.default.resolve(__dirname, '../uploads/', usuarioId, 'post', img);
        const existe = fs_1.default.existsSync(pathUserImg);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/imgs/404.jpg');
        }
        return pathUserImg;
    }
}
exports.default = FileSystem;
