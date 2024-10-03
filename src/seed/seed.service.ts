import { Injectable } from '@nestjs/common';
import { PokeAxios } from './interfaces/pokeAxios.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>,
    //Aqui donde definimos el tipo que sera, es la clase que se va a inicializar
    private readonly http : AxiosAdapter,
  ){}

  async executeSeed(){
    //Vamos a utilizar un generico y creamos una interfaz para obtener la estructura de la respuesta
    const data = await this.http.get<PokeAxios>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    const pokemonToInsert : {name: string, no: number}[] = [];
    //destructuramos directamente los valores del pokemon
    await this.pokemonModel.deleteMany();
    data.results.forEach( ({name, url}) => {
      const segments = url.split('/');
      const no : number = +segments[segments.length -2];
    //   await this.pokemonModel.create({name, no});
    pokemonToInsert.push({name, no})
    });
    //insertamos los datos en la base de datos
    await this.pokemonModel.insertMany(pokemonToInsert);
    
    return 'Pokemos agregados correctamente'
  }
}
