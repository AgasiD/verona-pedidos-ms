import { Injectable } from "@nestjs/common";
import { HttpService } from "src/common/services/http/http.service";
import { Pedido } from "../entities/pedido.entity";
import { RpcException } from "@nestjs/microservices";
import { PedidosModule } from "../pedidos.module";
import { getDataFromJSON } from "src/common/helpers/helper";


@Injectable()
export class PedidosRepository {

    uri: string;
    pedidos: Pedido[];


    constructor(private readonly http: HttpService) {
        this.uri = process.env.GOOGLE_URI + '/pedido'
    }

    async findOne(pedidoId: string) {
        if (this.pedidos) {
            await this.findAll(); // Ensure pedidos are loaded
            let pedido = this.pedidos.find(pedido => pedido.id == pedidoId);
            if (pedido) return pedido;
        }
        let response = await this.http.get(`${this.uri}/${pedidoId}.json`);
        if (response.status >= 300) throw new RpcException({ status: response.status, message: response.statusText });

        let datos = response.data;
        if (datos != null) this.pedidos = getDataFromJSON(datos).map(data => new Pedido(data.id, data.attributes))
        return this.pedidos;
    }

    async findAll() {
        if(this.pedidos) return this.pedidos;

        let response = await this.http.get(`${this.uri}.json`);
        if (response.status >= 300) throw new RpcException({ status: response.status, message: response.statusText });

        let datos = response.data;
        if (datos != null) this.pedidos = getDataFromJSON(datos).map(data => new Pedido(data.id, data.attributes))
        return this.pedidos;
    }

    async create(pedido: Pedido) {
        let response = await this.http.post(`${this.uri}.json`, {}, pedido)
        if (response.status >= 300) throw new RpcException({ status: response.status, message: response.statusText });
        let data = response.data;
        pedido.id = data.name;
        this.pedidos.push(pedido);
        return pedido;
    }

    async delete(pedidoId: string) {
        let response = await this.http.delete(`${this.uri}/${pedidoId}`);
        if (response.status >= 300) throw new RpcException({ status: response.status, message: response.statusText });
        this.pedidos = this.pedidos.filter(pedido => pedido.id != pedidoId);
    }

    async update(pedidoId: string, pedido: Pedido) {
        const response = await this.http.put(`${this.uri}/${pedidoId}.json`, {}, pedido);
        if (response.status >= 300) throw new RpcException({ status: response.status, message: response.statusText });
        let i = this.pedidos.findIndex(o => o.id == pedido.id);
        this.pedidos[i] = pedido;
        return pedido;
    }


}