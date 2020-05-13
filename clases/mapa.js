"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mapa {
    constructor() {
        this.marcadores = {
            '1': {
                id: '1',
                nombre: 'Carnitas lokas',
                lng: -103.18958957306585,
                lat: 20.293045257196084,
                color: '#dd8fee'
            },
            '2': {
                id: '2',
                nombre: 'Tu negocio',
                lng: -103.19124617492014,
                lat: 20.291613337245167,
                color: '#790af0'
            },
            '3': {
                id: '3',
                nombre: 'Aqui se pistea agusto',
                lng: -103.18695727729175,
                lat: 20.28904735626668,
                color: '#19884b'
            }
        };
    }
    agregarMarcador(marcador) {
        this.marcadores[marcador.id] = marcador;
    }
    getMarcadores() {
        return this.marcadores;
    }
    borrarMarcador(id) {
        delete this.marcadores[id];
        return this.getMarcadores();
    }
    moverMarcador(marcador) {
        try {
            this.marcadores[marcador.id].lng = marcador.lng;
            this.marcadores[marcador.id].lat = marcador.lat;
        }
        catch (err) {
            console.warn('Aveces pasan estas pendejadas', err);
        }
    }
}
exports.Mapa = Mapa;
