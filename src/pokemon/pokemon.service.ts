import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  //para poder utilizar el modelo de mongoose tenemos que inyectarlo como una dependencia, el modelo sera de tipo Model de mongoose con el generico de la entidad
  //Tambien tenemos que utilizar el decorador @InjectModel() dentro de los parentesis ira la entidad y el name que es el name de la funcion de la entidad, no de la propiedad
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const newPokemon = await this.pokemonModel.create(createPokemonDto);
      return newPokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon : Pokemon;
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({ no: term});
    };
    //Vamos a uitilizar una funcion de mongo para validar si el termino es un id
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    };
    //si el termino no es un id y no es un numero, entonces lo buscamos por el name
    if(!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }

    if(!pokemon) throw new NotFoundException(`Pokemon no encontrado con el termino ${term}`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    //si existe, este sera un objeto con todos los metodos de mongoose
    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
    try {
      await pokemon.updateOne(updatePokemonDto);
      //mongo no nos retorna directamente el poquemon
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const {deletedCount} = await this.pokemonModel.deleteOne({ _id: id});
    if(deletedCount === 0) {
      throw new NotFoundException(`Pokemon no encontrado con el id ${id}`);
    }
    return;
  }

  private handleExceptions( error : any) {
    if( error.code === 11000){
      throw new BadRequestException(`El siguiente valor se encuentra duplicado ${ JSON.stringify( error.keyValue )}`);
    }
    console.log(error)
    throw new InternalServerErrorException('No se pudo actualizar el pokemon');
  }
}
