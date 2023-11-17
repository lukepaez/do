FROM --platform=linux/amd64 node:16

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

RUN mkdir dist/db/
COPY src/db/ dist/db/

# expose api port
EXPOSE 5005

CMD ["node", "dist/server.js"]