import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { NatsModule } from 'src/nats/nats.module';
import { HttpService } from 'src/common/services/http/http.service';
import { PedidosRepository } from './repository/pedidos.repository';

@Module({
  controllers: [PedidosController],
  providers: [HttpService, PedidosService, PedidosRepository],
  imports: [NatsModule]
  
})
export class PedidosModule {}
