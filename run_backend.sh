#!/usr/bin/sh

export $(grep "MONGO_PORT" .env | xargs)
docker run -d --name kglobal-mongo -p $MONGO_PORT:27017 mongo:latest
npm run start:dev
