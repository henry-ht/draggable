"use strict";
// archivo: miArchivo.ts
Object.defineProperty(exports, "__esModule", { value: true });
var MiClase = /** @class */ (function () {
    function MiClase() {
        // Inicializar la función de callback en el constructor usando una función de flecha
        // this.miCallback = (mensaje: string) => {
        //     console.log(`Mensaje desde el callback: ${mensaje}`);
        // };
    }
    MiClase.prototype.runYa = function (msj) {
        this._ejecutarCallback(msj);
    };
    MiClase.prototype._ejecutarCallback = function (mensaje) {
        // Utilizar la función de callback definida en la clase
        // if (this.miCallback) {
        this.miCallback(mensaje);
        // } else {
        //     console.error("Error: this.miCallback no está definido.");
        // }
    };
    return MiClase;
}());
exports.default = MiClase;
