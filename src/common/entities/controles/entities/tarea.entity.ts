export class Tarea{

    id: string;
    subetapa: string;
    descripcion: string;
    isDefault: boolean;
    orden: number;
    multi: boolean;

    iniciado?: boolean;
    realizado?: boolean;
    tsIniciado?: number;
    tsRealizado?: number;
    idUsuario?: string;
    
    constructor(id = '', 
        {
            subetapa = '', 
            descripcion = '', 
            isDefault = true, 
            orden = 0,
            multi = false
        }){
        this.id = id;
        this.subetapa = subetapa
        this.descripcion = descripcion;
        this.isDefault = isDefault;
        this.orden = orden || -1;
        this.multi = multi;
    }
}
