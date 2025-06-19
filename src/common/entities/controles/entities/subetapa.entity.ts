import { Tarea } from "./tarea.entity";

export class SubEtapa {

    id: string;
    etapa: string;
    subEtapa: string;
    descripcion: string;
    isDefault: boolean;
    orden: number;
    obraId?: string;
    tareas?: Tarea[];
    constructor({ id = '',  obraId, etapa = '', subEtapa = '', descripcion = '', isDefault = true, orden = -1, tareas = []}) {
        this.id = id
        this.etapa = etapa
        this.subEtapa = subEtapa;
        this.descripcion = descripcion;
        this.isDefault = isDefault;
        this.orden = orden;
        this.obraId = obraId;
        this.tareas = tareas;
    }
}
