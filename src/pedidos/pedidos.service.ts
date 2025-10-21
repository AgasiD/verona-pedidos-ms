import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ESTADOS, Pedido } from "./entities/pedido.entity";
import { HttpService } from "src/common/services/http/http.service";
import * as uuid from 'uuid'
import { getDataFromJSON, handlerError } from "src/common/helpers/helper";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { Obra } from "src/common/entities/obras/obra.entity";
import { NATS_SERVICE } from "src/config/services";
import { firstValueFrom } from "rxjs";
import { CreatePedidoDTO } from "./dto/pedido.dto";
import { PedidosRepository } from "./repository/pedidos.repository";
import { Usuario } from "src/common/entities/usuarios/usuario.entity";
@Injectable()
export class PedidosService {

  pedidos: Pedido[]
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly pedidosRepository: PedidosRepository
  ) {

  }


  async getObras() {
    return await firstValueFrom(this.client.send('obras.obtenerObras', {}))
  }
  async getObra(obraId: string) {
    return await firstValueFrom(this.client.send('obras.obtenerObra', { obraId }))
  }
  async getUsuariosByRole(roles: number[]) {
    return await firstValueFrom(this.client.send('usuarios.obtenerUsuariosByRole', roles))
  }
  async getUsuario(usuarioId: string){
    return (await firstValueFrom(this.client.send('usuarios.obtenerUsuario', { usuarioId })) as Usuario)
  }


  async actualizarPedidoObra(pedidoDTO: Pedido) {

    try {
      if (pedidoDTO.estado == ESTADOS.ENTREGADO) {
        pedidoDTO.estado = ESTADOS.CERRADO;
      }
      let pedido_response = await this.modificarPedido(pedidoDTO);
      let obra = (await this.getObra(pedidoDTO.idObra))!;
      // await this.generarNotificacionPedido(pedido_response!, obra) TODO
      return pedidoDTO;
    } catch (err) {
      handlerError(err)
    }
  }

  // private async generarNotificacionPedido(pedido: Pedido, obra: Obra) { TODO

  //   let title, subtitle, usuarioToNotify, notificacion_push, roles;

  //   let novedad = {
  //     id: uuid.v4(),
  //     tipo: 1, // tipo obra
  //     obraId: obra.id,
  //     menu: 6,
  //     pedidoId: pedido.id,
  //   }
  //   switch (pedido.estado) {
  //     case ESTADOS.SIN_ASIGNAR: /* Rol activador: Comprador Notificar a usuario creador, pms y arqs de obra*/
  //       title = `Pedido ${pedido.titulo} de obra: ${obra.nombre} ${obra.lote}`;
  //       subtitle = 'Cambio de estado: Sin confirmar';
  //       roles = [2, 3];
  //       break;
  //     case ESTADOS.PENDIENTE_COMPRA: /* Rol activador: Comprador Notificar a usuario creador y pms de obra */
  //       title = `Novedad en pedido ${pedido.titulo} de obra: ${obra.nombre}`;
  //       subtitle = 'Cambio de estado: Pendiente de Compra';
  //       roles = [2]
  //       break;
  //     case ESTADOS.PENDIENTE_ENTREGA: /* Pedido en en stock, pendiente de entrega. Rol activador: Comprador Rol notificado: usuario creador y pms de obra *Delivery si corresponde */
  //       title = `Novedad en pedido ${pedido.titulo} de obra: ${obra.nombre}`;
  //       subtitle = `Cambio de estado: Pendiente de Entrega. Dia ${pedido.fechaEstimada}`;
  //       roles = [2]
  //       if (!pedido.entregaExterna) {
  //         /*  Envio notificacion a usuario DELIVERY */
  //         // Notifico asignacion a usuario delivery, es diferente proceso porque la Notificacion es distinta.
  //         let titleDelivery = `Nuevo pedido asignado`;
  //         let subtitleDelivery = `Para obra ${obra.nombre} Día de entrega: ${pedido.fechaEstimada}`;
  //         let notificacionDelivery = new Notificacion('pedido', titleDelivery, subtitleDelivery, pedido.id);
  //         let delivery = await this.getUsuario(pedido.usuarioAsignado);
  //         let notificacion_push_delivery = {
  //           title: titleDelivery,
  //           body: subtitleDelivery,
  //           data: { type: 'pedido', pedidoId: pedido.id, obraId: pedido.idObra, navega: "true" }
  //         }
  //         await this.usuarioService.agregarNotificacionUsuario([delivery], notificacionDelivery, novedad);
  //         await this.pushNotifService.enviarNotificaciones(usuarioToNotify, notificacion_push_delivery)
  //       }
  //       break;
  //     case ESTADOS.CERRADO: // PEDIDO CERRADO
  //       title = `Pedido entregado`;
  //       subtitle = `Para obra ${obra.nombre} Día de entrega: ${pedido.fechaEstimada}`;
  //       roles = [2, 5]
  //       break;
  //   }
  //   notificacion_push = {
  //     title,
  //     body: subtitle,
  //     data: { type: 'pedido', pedidoId: pedido.id, obraId: pedido.idObra, navega: "true" }
  //   }
  //   await this.notificarEstadoPedido(pedido, roles, obra, title, subtitle, novedad, notificacion_push)
  // }


  // private async notificarEstadoPedido(pedido: Pedido, roles: number[], obra: Obra, title: string, subtitle: string, novedad: any, notificacion_push: any) {
  // TODO
  //   let usuarioToNotify = (await this.getUsuariosByRole(roles)).filter(usuario => obra!.personalAsignado(usuario.id))
  //   if (!usuarioToNotify.find(usu => usu.id === pedido.idUsuario)) {
  //     let usuarioCreador = (await this.getUsuario(pedido.idUsuario))!;
  //     usuarioToNotify.push(usuarioCreador)
  //   }
  //   if (pedido.estado == ESTADOS.ENTREGADO) await this.usuarioService.quitarNovedadPedidoUsuario(usuarioToNotify, pedido); // le quito novedades para que no quede marcado cuando pasa a estado "CERRADO" 
  //   let notificacion = new Notificacion('pedido', title, subtitle, pedido.id);
  //   await this.usuarioService.agregarNotificacionUsuario(usuarioToNotify, notificacion, novedad);
  //   await this.pushNotifService.enviarNotificaciones(usuarioToNotify, notificacion_push)
  //   return { title, subtitle, notificacion, novedad, usuarioToNotify };
  // }


  async borrarPedido(pedidoId: string) {
    try {
      let pedido = await this.obtenerPedido(pedidoId);
      // await firstValueFrom( this.client.emit('obras.eliminarPedido', { idObra: pedido.idObra, pedidoId })) TODO
      return true;
    } catch (err) {
      handlerError(err)
    }
  }

  async nuevoPedidoObra(pedidoDTO: CreatePedidoDTO) {
    try {

      let pedido = await this.agregarPedido(pedidoDTO);
      // await this.notificarPedidoNuevo(pedido!) TODO
      return pedido;
    } catch (err) {
      throw err
    }
  }


  private async agregarPedido(pedidoDTO: CreatePedidoDTO) {
    try {
      console.log(pedidoDTO)
      pedidoDTO.titulo = pedidoDTO.titulo.replace('/', '-');
      let pedido = new Pedido(null, pedidoDTO);
      let user = (await this.getUsuario(pedidoDTO.idUsuario))!
      pedido.usuario = { nombre: user.nombre, apellido: user.apellido, fullname: user.fullName };
      console.log(pedido)
      let data = await this.grabarPedido(pedido);
      const response = await firstValueFrom(this.client.send(`obras.agregarPedido`, { idObra: pedido.idObra, pedidoId: data.id }));
      return data;
    } catch (err) {
      handlerError(err)
    }
  }

  // private async notificarPedidoNuevo(pedido: Pedido) {

  //   let compradores = (await this.getUsuariosByRole([5]))!;
  //   let obra = (await this.getObra(pedido.idObra))!;
  //   let novedad = {
  //     id: uuid.v4(),
  //     tipo: 1, // tipo obra
  //     obraId: obra.id,
  //     menu: 6,
  //     pedidoId: pedido.id,
  //   }

  //   let notificacion = new Notificacion('pedido', `Nuevo pedido generado: ${obra.nombre}`, '', pedido.id);
  //   let notificacion_push = {
  //     title: `Nuevo pedido generado: ${obra.nombre}`,
  //     body: `Prioridad: ${pedido.prioridadText}`,
  //     data: { type: 'pedido', obraId: obra.id, pedidoId: pedido.id, navega: "true" },
  //   }
  //   await this.usuarioService.agregarNotificacionUsuario(compradores, notificacion, novedad);
  //   await this.pushNotifService.enviarNotificaciones(compradores, notificacion_push);
  // } TODO


  async grabarPedido(pedido: Pedido) {
    
    await this.obtenerPedidos();
    if (!this.existePedido(pedido.titulo)) {
      const pedido_response = await this.pedidosRepository.create(pedido)
      return pedido_response;
    } else {
      console.log(pedido)
      throw new RpcException({ status: HttpStatus.CONFLICT, message: `Pedido existente.` })
    }
  }


  eliminarPedido = async (id) => {
    try {
      if (!this.existePedido(id)) throw new RpcException({ message: `Pedido no encontrado.`, status: HttpStatus.NOT_FOUND })
      this.pedidosRepository.delete(id)
    } catch (err) {
      handlerError(err);
    }
  }

  modificarPedido = async (pedido: Pedido) => {
    try {
      await this.obtenerPedidos();
      if (this.existePedido(pedido.id)) {
        return this.pedidosRepository.update(pedido.id, pedido)
      } else {
        throw new RpcException({ status: HttpStatus.CONFLICT, message: `Pedido no encontrado.` })
      }
    } catch (err) {
      handlerError(err);
    }
  }

  async cerrarPedido(pedidoId: string) {
    try {
      let pedido = await this.obtenerPedido(pedidoId);
      if (!pedido) throw new Error('Error al recuperar pedido');

      pedido.cerrarPedido();

      let pedido_updated = await this.modificarPedido(pedido);
      return pedido_updated;

    } catch (err) {
      handlerError(err);
    }
  }

  existePedido(nombre) {
    console.log('id o nombre de pedido')
    console.log(nombre)

    return this.pedidos.findIndex(x => x.titulo == nombre || x.id == nombre) > -1;
  }


  async obtenerPedidosByUsuario(dto: any) {
    const { obraId, usuarioId } = dto;
    try {
      let pedidosObra = await this.obtenerPedidoByObraID(obraId);

      let pedidoUsuario: Pedido[] = [];
      pedidoUsuario = await this.obtenerPedidosObra(pedidosObra.map(ped => ped.id));
      if (pedidosObra.length > 0) pedidoUsuario = pedidoUsuario.filter(pedido => pedido.idUsuario == usuarioId);


      return pedidoUsuario
    } catch (err) {
      handlerError(err)
    }

  }

  async obtenerPedidosByDelivery(dto: any) {
    const { obraId, deliveryId } = dto;
    try {
      let pedidosObra = await this.obtenerPedidoByObraID(obraId);
      let pedidosAsignados: Pedido[] = []
      if (pedidosObra.length > 0) pedidosAsignados = pedidosObra.filter(pedido => [3, 4, 5].includes(pedido.estado) && pedido.usuarioAsignado == deliveryId);
      return pedidosAsignados
    } catch (err) {
      handlerError(err)
    }
  }

  async obtenerPedidosUsuario() {
    let pedidos = await this.obtenerPedidos()
    for (let pedido of pedidos) {
      let idUsuario = pedido.idUsuario;
      if (idUsuario == '3333333') {
        idUsuario = '-N1JMn2-R5mlliaJpG3r';
      }
      let usuario = (await this.getUsuario(idUsuario))!;
      pedido.usuario = { apellido: usuario.apellido || '', nombre: usuario.nombre || '', activo: usuario.activo || false };;
    }
    return pedidos;
  }


  obtenerPedido = async (pedidoId) => {
    await this.obtenerPedidos({ incluye_cerrados: true });
    let pedido = this.pedidos.filter(pedido => pedido.id == pedidoId)[0];
    if (!pedido) throw new RpcException({ status: HttpStatus.NOT_FOUND, message: `Pedido ${pedidoId} no encontrado` })

    if (pedido.imagenId != undefined) {
      if (typeof pedido.imagenId == 'string') {
        if (pedido.imagenId == '') {
          pedido.imagenId = [];
        } else {
          pedido.imagenId = [pedido.imagenId]
        }
      }
    }

    return pedido;
  }

  obtenerPedidosObra = async (ids, incluye_cerrados = false) => {
    let pedidos = await this.obtenerPedidos({ incluye_cerrados });
    let pedidos_filtrados = pedidos.filter(p => ids.includes(p.id)) || [];
    if (!incluye_cerrados) pedidos_filtrados.filter(pedido => pedido.estado != ESTADOS.CERRADO)

    pedidos_filtrados.sort( (a,b) => {
      return a.ts > b.ts ? 1 : -1
    })
    return pedidos_filtrados

  }

  async obtenerPedidoByObraID(obraId) {
    return (await this.obtenerPedidos()).filter(ped => ped.idObra === obraId);
  }

  obtenerPedidos = async ({ incluye_cerrados } = { incluye_cerrados: false }) => {
    await this.cargarPedidos();
    if (!incluye_cerrados)
      return this.pedidos.filter(p => p.estado != ESTADOS.CERRADO)
    return this.pedidos;
  }

  private async cargarPedidos() {
    if (!this.pedidos || this.pedidos.length == 0) {
      this.pedidos = await this.pedidosRepository.findAll();
    }
    return this.pedidos;
  }

}
