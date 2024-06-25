# Information
Docker must be installed for this repository to work. Also install/update the Nest JS package globally:
```bash
npm i -g @nestjs/cli
```

## Running the app
Create an ```.env``` file with the following contents in the root of the project (this us just an example):
```
MONGO_HOST=localhost
MONGO_PORT=6969
MONGO_DB=kglobal
BACKEND_PORT=4000
JWT_ACCESS_SECRET="secret"
JWT_REFRESH_SECRET="refresh_secret"
JWT_TTL=40
```
Install dependencies and run the backend:
```bash
npm ci
./run_backend.sh
```

The Swagger is at ```http://localhost:your_backend_port/api```, where ```your_backend_port``` is a port from the ```.env``` file.
