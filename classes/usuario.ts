export class Usuario {

    public id: string;
    public nombre: string;
    public sala: string;
    public rol: string;
    public referencia_externa: string;
    public id_externo: string;


    constructor(id: string) {
        this.id = id;
        this.nombre = 'sin-nombre';
        this.sala = 'sin-sala';
        this.rol = 'sil-rol';
        this.referencia_externa = 'sin-referencia';
        this.id_externo = 'sin-id-externo'
    }
}