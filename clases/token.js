"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../global/environment");
class Token {
    constructor() {
    }
    static crearJwToken(payload) {
        return jsonwebtoken_1.default.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });
    }
    ;
    static validarToken(userToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
exports.default = Token;
Token.seed = environment_1.seed;
Token.caducidad = '30d';
