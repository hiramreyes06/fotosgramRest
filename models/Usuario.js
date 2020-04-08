"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let rolesValidos = {
    values: ['admin', 'usuario'],
    message: '{VALUE} no es un rol valido'
};
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Ya en uso']
    },
    role: {
        type: String,
        required: [true, 'El role es requerido'],
        default: 'usuario',
        enum: rolesValidos
    },
    google: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    }
});
usuarioSchema.method('compararPassword', function (password = '') {
    return bcryptjs_1.default.compareSync(password, this.password);
});
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
