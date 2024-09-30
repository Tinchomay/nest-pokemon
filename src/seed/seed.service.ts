import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeAxios } from './interfaces/pokeAxios.interface';

@Injectable()
export class SeedService {

  private readonly axios : AxiosInstance = axios;

  async executeSeed(){
    //Vamos a utilizar un generico y creamos una interfaz para obtener la estructura de la respuesta
    const {data} = await this.axios.get<PokeAxios>('https://pokeapi.co/api/v2/pokemon?limit=10');
    //destructuramos directamente los valores del pokemon
    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      //Utilizamos el -2 para tomar el elememto que este siempre en la penultima posicion, el -1 es el ultimo
      const no : number = +segments[segments.length -2];
      console.log({name, no})
    })
    return data.results;
  }
}
