"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
exports.SERVER_PORT = Number(process.env.PORT) || 3000;
exports.seed = process.env.SEED || 'el-string-mas-segura-posible';
exports.CLIENT_ID = '892703108718-t8foigi3dhbasmlg49dls2muv8iihkb7.apps.googleusercontent.com';
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/fotosgram';
}
else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
