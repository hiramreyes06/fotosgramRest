"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
exports.SERVER_PORT = Number(process.env.PORT) || 3000;
exports.seed = process.env.SEED || 'el-string-mas-segura-posible';
exports.CLIENT_ID = '156692169272-0juufebl9iev6ro0c0g2t51o3l9ng6r7.apps.googleusercontent.com';
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/fotosgram';
}
else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
