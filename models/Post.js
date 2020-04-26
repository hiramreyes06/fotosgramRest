"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const multimedia = new mongoose_1.Schema({
    tipo: {
        type: String
    },
    url: {
        type: String
    },
    _id: { id: false }
});
const postSchema = new mongoose_1.Schema({
    fecha: {
        type: Date
    },
    titulo: {
        type: String,
        required: [true, 'El titulo es necesesario']
    },
    texto: {
        type: String,
    },
    coords: {
        type: String
    },
    multimedia: [multimedia],
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Se necesita un autor']
    }
});
postSchema.pre('save', function () {
    this.fecha = new Date();
});
;
exports.Post = mongoose_1.model('Post', postSchema);
