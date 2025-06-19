import { IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreatePedidoDTO{

    @IsString()
    @MinLength(4)
    idUsuario: string;

    @IsString()
    @MinLength(4)
    idObra: string;

    @IsString()
    @IsOptional()
    nota?: string;

    @IsString()
    @MinLength(4)
    titulo: string;

    @IsString()
    @MinLength(4)
    fechaDeseada: string;

    @IsNumber()
    @IsPositive()
    prioridad: number;
}