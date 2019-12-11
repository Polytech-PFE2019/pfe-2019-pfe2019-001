FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./scripts/requirements.txt ./

RUN npm install
RUN apt-get update || : && apt-get install python3 -y
RUN apt install python3-pip -y
RUN pip3 install --upgrade setuptools
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 1337
CMD [ "node", "server.js" ]