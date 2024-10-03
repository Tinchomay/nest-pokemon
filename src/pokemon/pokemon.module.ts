import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  //necesitamos agregar el modulo de moongose para definirlo
  imports: [
    //Vamos a utilizar forFeature
    MongooseModule.forFeature([{
      //debemos de proporcionar estos datos para que crea la relacion con la coleccion y el schema
      //el name no es el name de la entidad, si no del documento de mongoose 
      name: Pokemon.name,
      //el schema es el que definimos en la entidad
      schema: PokemonSchema,
    }]),
    ConfigModule
  ],
  exports: [MongooseModule]
})
export class PokemonModule {}
