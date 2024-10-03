<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1.- Clonar el repositorio

2.- Ejecutar
```
yarn install
```

3.- Tener nest cli instalado
```
npm i -g @nestjs/cli
```

4.- Levantar la base de datos
```
docker compose up -d
```

5.- Copiar __.env.template__ y renombrar __.env__

6.-Construir base de datos
```
Visitar la ruta /api/v2/seed con metodo get
```

##Stack usado
* MongoDB
* NestJS
* Docker
