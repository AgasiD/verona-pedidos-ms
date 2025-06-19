export enum ESTADOS {
    SIN_ASIGNAR = 1,
    PENDIENTE_COMPRA = 2,
    PENDIENTE_ENTREGA = 3,
    ENTREGADO = 4,
    CERRADO = 5,

}

export class Pedido {

    id: string;
    titulo: string;
    idUsuario: string;
    idObra: string;
    nota: string;
    prioridad: number;
    usuarioAsignado: string;
    ts: number;
    tsCerrado: number;
    tsAsignado: number;
    fechaEstimada: string;
    fechaDeseada: string;
    indicaciones: string;
    imagenId?;
    estado: ESTADOS;
    entregaExterna: boolean;
    nombreUsuario?: string
    usuario?: any
    constructor(id,
        { titulo = '',
            idUsuario = '',
            idObra = '',
            nota = '',
            prioridad = 1,
            usuarioAsignado = '',
            ts = Date.now(),
            tsCerrado = 0,
            tsAsignado = 0,
            fechaEstimada = '',
            fechaDeseada = '',
            indicaciones = '',
            imagenId = [],
            estado = ESTADOS.SIN_ASIGNAR,
            entregaExterna = false,
            nombreUsuario = '',
        usuario = '' }) {
        this.id = id || '';
        this.titulo = titulo || 'Sin título'
        this.idUsuario = idUsuario;
        this.idObra = idObra;
        this.nota = nota;
        this.prioridad = prioridad || 1;
        this.usuarioAsignado = usuarioAsignado || '';
        this.ts = ts;
        this.tsCerrado = tsCerrado;
        this.tsAsignado = tsAsignado;
        this.fechaEstimada = fechaEstimada;
        this.fechaDeseada = fechaDeseada;
        this.indicaciones = indicaciones;
        this.imagenId = imagenId;
        this.estado = estado; // [ 0- Sin asignar | 1- Pendiente de compra | 2- Pendiente de entrega (asignado) | 3- Entregado/Cerrado]
        this.entregaExterna = entregaExterna;
        this.nombreUsuario = nombreUsuario;
        this.usuario = usuario;
    }


    get prioridadText () {
         switch (this.prioridad) {
              case 1:
                return 'Baja'
              case 2:
                return 'Media'
              case 3:
                return 'Alta'
            }
    
    }


    cerrarPedido(){
        this.tsCerrado = Date.now();
    }

}

