import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

//Como vamos a trabajar con mongoose la entity sera nuestro modelo para los documentos de la BD, y tiene que extender Document de mongoose
//Tambien tenemos que agregarle el decorador schema de mongoose
@Schema()
export class Pokemon extends Document {
    //tenemos que agregarle propiedades a los elementos para mongo
    @Prop({
        unique: true,
        index:true
    })
    name: string;

    @Prop({
        unique: true,
        index:true
    })
    no: number;
}

//Aqui creamos el schema con este metodo y le pasamos el modelo
export const PokemonSchema = SchemaFactory.createForClass(Pokemon)