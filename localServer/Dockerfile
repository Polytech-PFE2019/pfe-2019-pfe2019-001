# ---- Base Node ----
FROM node:carbon AS base
# Create app directory
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies  
COPY package*.json ./
COPY ./scripts/requirements.txt ./

# install app dependencies including 'devDependencies'
RUN apt-get update || : && apt-get install python3 -y
RUN apt install python3-pip -y
RUN pip3 install --upgrade setuptools
RUN pip3 install -r requirements.txt
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build  
WORKDIR /app
COPY . /app

# --- Release with Alpine ----
FROM node:8.9-alpine AS release  
ENV CAMSERVER=localhost
ENV SERVER=localhost
ENV PORT=1337
ENV CAMPORT=3000
ENV WEBPORT=4200
# Create app directory
WORKDIR /app
COPY --from=dependencies /app/package.json ./
# Install app dependencies
RUN npm install
COPY --from=build /app ./
EXPOSE 1337 4200
CMD ["node", "server.js"]
