FROM node:16

# work directory
WORKDIR /usr/src/app

# copy package.json
COPY package*.json ./

# npm install
RUN npm install

# copy src files
COPY . .

# build
RUN npm run build

# expose api port
EXPOSE 5005

CMD ["node", "dist/server.js"]