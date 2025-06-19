import { ConflictException, NotFoundException } from "@nestjs/common";
import { getFullDate } from "src/common/helpers/helper";

import { Etapa } from "src/common/entities/controles/entities/etapa.entity";
import { Tarea } from "src/common/entities/controles/entities/tarea.entity";


export class Obra {
    eliminarInactividad(inactividadId: string) {
        this.diasInactivos = this.diasInactivos.filter(i => i.id != inactividadId);
    }
    
    id: string
    pedidos: string[]
    descripcion: string
    nombre: string
    barrio: string
    lote: string
    propietarios: any[]
    diasEstimados: number
    imageId: string
    chatE: string
    chatI: string
    diasInactivos: any[]
    driveFolderId: string
    folderImages: string
    rootDriveCliente: string
    folderImagesCliente: string
    etapas: Etapa[];
    imageURL: string;
    docs: any[]
    diasTranscurridos: number
    diaInicio: number
    ts: string
    equipo: any[]
    enabledFiles: any[]
    idWScontacts: string;
    latitud: number
    longitud: number
    folderPedidoImages: string
    idWSgroup: string
    articulosId: any
    activo: boolean = true


    constructor(id = '', {
        pedidos = new Array<string>(),
        descripcion = 'Sin descripción',
        nombre = '',
        barrio = '',
        lote = '',
        propietarios = new Array<string>(),
        diasEstimados = 100,
        imageId = '',
        chatE = '',
        chatI = '',
        diasInactivos = [],
        driveFolderId = '',
        folderImages = '',
        rootDriveCliente = '',
        folderImagesCliente = '',
        etapas = new Array<Etapa>(),
        imageURL = '',
        docs = [],
        diasTranscurridos = 0,
        diaInicio = 0,
        ts = getFullDate() + ' ' + new Date().getTime(),
        equipo = [],
        enabledFiles = [],
        latitud = 0,
        longitud = 0,
        folderPedidoImages = '',
        idWSgroup = '',
        articulosId = '',
        activo = true,
    }
    ) {
        this.articulosId = articulosId;
        this.barrio = barrio;
        this.chatE = chatE; //id chat
        this.chatI = chatI; //id chat
        this.descripcion = descripcion
        this.diaInicio = diaInicio
        this.diasEstimados = diasEstimados;
        this.diasInactivos = diasInactivos //array de objetos
        this.diasTranscurridos = diasTranscurridos;
        this.docs = docs; // array de objetos
        this.driveFolderId = driveFolderId;
        this.enabledFiles = enabledFiles;
        this.equipo = equipo;
        this.etapas = etapas;
        this.folderImages = folderImages;
        this.folderImagesCliente = folderImagesCliente;
        this.folderPedidoImages = folderPedidoImages;
        this.id = id;
        this.idWSgroup = idWSgroup;
        this.imageId = imageId;
        this.imageURL = imageURL
        this.latitud = latitud;
        this.longitud = longitud;
        this.lote = lote;
        this.nombre = nombre;
        this.pedidos = pedidos;
        this.propietarios = propietarios; //array de ids
        this.rootDriveCliente = rootDriveCliente;
        this.ts = ts;
        this.activo = activo;
    }



    getCantDiasInactivos() {
        return this.diasInactivos.length;
    }

    setInactividad(inactividad) {
        this.diasInactivos.push(inactividad);
    }

    propietarioAsignado(propId) {
        if (this.propietarios.findIndex(p => p.dni == propId || p.id == propId) == -1) return false
        return true;
    }

    personalAsignado(personalId) {
        if (this.equipo.findIndex(p => p.dni == personalId || p.id == personalId) == -1) return false
        return true;
    }

    quitarPersonal(usuarioId) {
        if (this.personalAsignado(usuarioId)) {
            let i = this.equipo.findIndex(p => p.dni == usuarioId || p.id == usuarioId);
            this.equipo.splice(i, 1);
        }else{
            throw new ConflictException('Personal no asignado en obra.')

        }
    }

    quitarPropietario(propId) {
        if (this.propietarioAsignado(propId)) {
            let i = this.propietarios.findIndex(p => p.dni == propId || p.id == propId);
            this.propietarios.splice(i, 1);
        }else{
            throw new ConflictException('Propietario no asignado en obra.')

        }
    }

    habilitarArchivos(ids: any) {
        if (!this.enabledFiles) {
            this.enabledFiles = [];
        }
        this.enabledFiles = this.enabledFiles.concat(ids);
    }

    agregaEtapa(etapa: Etapa) {

        if (this.isEtapaAsignada(etapa.id)) {
            throw new ConflictException('Etapa ya se encuentra asignada a la obra')
        }
        this.etapas.push(etapa);
    }

    quitarEtapa(etapaId: string) {
        if (!this.isEtapaAsignada(etapaId)) {
            throw new ConflictException('Etapa NO se encuentra asignada a la obra')
        }
        let indexEtapa = this.etapas.findIndex(etapa => etapa.id.includes(etapaId));
        this.etapas.splice(indexEtapa, 1);
    }

    isSubEtapaAsignada(etapaId: string, subetapaId: string): boolean {
        let etapa = this.obtenerEtapa(etapaId);
        return etapa.subetapas!.findIndex(sub => sub.id === subetapaId) > -1;
    }

    isEtapaAsignada(etapaId): boolean {
        return this.etapas.findIndex(etapa => etapa.id === etapaId) > -1;
    }


    obtenerEtapa(etapaId): Etapa {

        let etapa = this.etapas.find(etapa => etapa.id == etapaId);
        if (etapa == undefined) throw new NotFoundException(`Etapa ${etapaId} no encontrada en obra ${this.nombre}`)
        return etapa;
    }

    agregaSubetapa(subetapa) {
        let etapa = this.obtenerEtapa(subetapa.etapaId)
        etapa.subetapas!.splice(subetapa.orden! > 0 ? subetapa.orden! : 0, 0, subetapa)
    }

    obtenerSubetapa(etapaId, subetapaId): any {
        let etapa = this.obtenerEtapa(etapaId);
        let subetapa = etapa.subetapas!.find(sub => sub.id == subetapaId);
        if (subetapa == undefined) throw new NotFoundException(`Subtapa ${subetapaId} no encontrada en obra ${this.nombre}`)
        if (!subetapa.tareas) {
            subetapa.tareas = [];
        }
        return subetapa
    }

    quitarSubetapa(etapaId, subetapaId) {
        if (!this.isSubEtapaAsignada(etapaId, subetapaId)) {
            throw new ConflictException('Etapa NO se encuentra asignada a la obra')
        }
        let etapa = this.obtenerEtapa(etapaId);
        const index = etapa.subetapas!.findIndex(sub => sub.id == subetapaId);
        etapa.subetapas!.splice(index, 1);
    }

    asignarSubetapa(etapaId, subetapa) {
        let etapa = (this.obtenerEtapa(etapaId))!;
        etapa.subetapas!.forEach(sub => {
            if (sub.orden >= subetapa.orden) {
                sub.orden = sub.orden + 1;
            }
        })
        etapa.subetapas!.push(subetapa);
        etapa.subetapas!.sort((a, b) => a >= b ? 1 : -1);

    }



    agregaTarea(etapaId: string, tarea: Tarea) {
        let subetapa = this.obtenerSubetapa(etapaId, tarea.subetapa)
        subetapa.tareas.splice(tarea.orden! > 0 ? tarea.orden! : 0, 0, tarea)

    }

    quitarTarea(etapaId: string, subetapaId: string, tareaId: string,) {
        let subetapa = this.obtenerSubetapa(etapaId, subetapaId)
        let indexTarea = subetapa.tareas.findIndex(tarea => tarea.id.includes(tareaId));
        if (subetapa.tareas[indexTarea].realizado) {
            throw new Error('No es posible eliminar una tarea ya realizada');
        }
        subetapa.tareas.splice(indexTarea, 1);

    }

    obtenerTarea(etapaId, subetapaId, tareaId) {
        let subetapa = this.obtenerSubetapa(etapaId, subetapaId)
        let tarea = subetapa.tareas.find(sub => sub.id == tareaId);
        if (tarea == undefined) throw new NotFoundException(`Tarea ${tareaId} no encontrada en obra ${this.nombre}`)

    }




    actualizarOrdenTareas(etapaId: any, subetapaId: any, tareas: any) {
        let subetapa = this.obtenerSubetapa(etapaId, subetapaId)
        subetapa.tareas = tareas;
    }

    agregarPedido(idPedido: string) {
        this.pedidos.push(idPedido);
    }

    eliminarPedido(idPedido: string) {
        let i = this.pedidos.findIndex(p => p == idPedido);
        this.pedidos.splice(i, 1);
    }

    agregarUsuario(auxUser: { id?: string; dni: string; email: string; nombre: string; apellido: string; role: any; profileURL?: string; }) {
        switch (auxUser.role) {
            case 3:
                if (this.propietarios && !this.propietarioAsignado(auxUser.id)) {
                    this.propietarios.push(auxUser);
                }
                break;
            default:
                // Arq - PM
                if (this.equipo && !this.personalAsignado(auxUser.id)) {
                    this.equipo.push(auxUser);
                }
                break;
        }
    }


    desactivarObra() {
        this.activo = false;
    }

}
