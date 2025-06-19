import { SubEtapa } from "./subetapa.entity";

export class Etapa {

    id: string;
    etapa: string;
    descripcion: string;
    isDefault: boolean;
    orden: number;
    subetapas?: SubEtapa[]

    constructor({
        id = '',
        etapa = '',
        descripcion = '',
        isDefault = true,
        orden = -1,
        subetapas
    }) {
        this.id = id;
        this.etapa = etapa;
        this.descripcion = descripcion;
        this.isDefault = isDefault;
        this.orden = orden;
        this.subetapas = subetapas;
    }
}

