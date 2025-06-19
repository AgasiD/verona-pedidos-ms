import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PedidosService } from './pedidos.service';

@Controller()
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) { }

  @MessagePattern('pedidos.actualizarPedidoObra')
  async actualizarPedidoObra(@Payload() payload: any) {
    const { pedidoDTO } = payload
    return await this.pedidosService.actualizarPedidoObra(pedidoDTO);
  }

  @MessagePattern('pedidos.obtenerPedidosObra')
  async obtenerPedidosObra(@Payload() payload: any) {
    const { pedidos, cerrados } = payload
    return await this.pedidosService.obtenerPedidosObra(pedidos, cerrados);
  }

  @MessagePattern('pedidos.obtenerPedido')
  async obtenerPedido(@Payload() payload: any) {
    const { pedidoId } = payload
    return await this.pedidosService.obtenerPedido(pedidoId);
  }

  @MessagePattern('pedidos.obtenerPedidos')
  async obtenerPedidos(@Payload() payload) {
    const { incluye_cerrados } = payload
    return await this.pedidosService.obtenerPedidos(incluye_cerrados);
  }

  @MessagePattern('pedidos.obtenerPedidosByDelivery')
  async obtenerPedidosByDelivery(@Payload() payload) {
    const { data } = payload
    return await this.pedidosService.obtenerPedidosByDelivery(data);
  }
  
  @MessagePattern('pedidos.obtenerPedidosByUsuario')
  async obtenerPedidosByUsuario(@Payload() payload) {
    const { data } = payload
    return await this.pedidosService.obtenerPedidosByUsuario(data);
  }

  @MessagePattern('pedidos.agregarPedido')
  async nuevoPedidoObra(@Payload() payload) {
    const { pedido } = payload
    return await this.pedidosService.nuevoPedidoObra(pedido);
  }

  @MessagePattern('pedidos.cerrarPedido')
  async cerrarPedido(@Payload() payload) {
    const { pedidoId } = payload;
    return await this.pedidosService.cerrarPedido(payload);
  }
  @MessagePattern('pedidos.borrarPedido')
  async borrarPedido(@Payload() payload) {
    const { pedidoId } = payload
    return await this.pedidosService.borrarPedido(pedidoId);
  }


}
