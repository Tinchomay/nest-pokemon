# Install dependencies only when needed

#Aqui creamos una imagen donde vamos a tener las dependencias de node y vamos almacenar las dependencias en cache para hacer mas rapido el build
#Aqui utilizamos node en la version 18-alpine3.15 y le ponemos el nombre de deps que es dependencias
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
#estamos trabajando en /app
WORKDIR /app
#copiamos el package.json, el yarn.lock y lo pegamos en la raiz que seria el /app
COPY package.json yarn.lock ./
#Aqui instalamos las dependencias y nos aseguramos que esten las mismas dependencias en los archivos pk y el yarn
RUN yarn install --frozen-lockfile

# Build the app with cache dependencies
#Esta es otra imagen que se llamara builder
FROM node:18-alpine AS builder
WORKDIR /app
#esto va a copiar el contenedor de deps la carpeta de node modules y los va a pegar en node_modules de este contenedor
COPY --from=deps /app/node_modules ./node_modules
#Aqui vamos a copiar todo lo que sea parent del Dockerfile a la raiz de nuestro contenedor y estara en /app
COPY . .
#Aqui ejecutamos el comando yarn build que es el comando que se encarga de compilar
RUN yarn build


# Production image, copy all the files and run next
#Creamos otro contenedor que sera el que se ejecutara
FROM node:18-alpine AS runner
# Set working directory
#en este directorio vamos a poner nuestra aplicacion, los anteriores /app son para trabajar la aplicacion antes de desplegar
WORKDIR /usr/src/app
#copiamos los archivos pk y yarn a la raiz
COPY package.json yarn.lock ./
#instalamos las dependencias en modo produccion
RUN yarn install --prod
#del contenedor del builder copiamos la carpeta de distribucion y lo pegamos en la carpeta dist de nustro contenedor
COPY --from=builder /app/dist ./dist

#este comando crea un directorio llamado pokeden en la raiz
# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

#Con este comando nos aseguramos que la aplicacion este en este directorio
# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso a un nuevo usuario para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

#este comando ejecuta el archivo main de dist de nuestro contenedor
CMD [ "node","dist/main" ]