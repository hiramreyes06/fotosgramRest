"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor(puerto) {
        this.port = puerto;
        this.app = express_1.default();
    }
    static init(puerto) {
        return new Server(puerto);
    }
    start(callback) {
        this.app.listen(this.port, callback());
    }
}
exports.default = Server;
