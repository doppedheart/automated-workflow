FROM node:20-alpine
WORKDIR /hooks

COPY package* .

RUN npm install

COPY . .

ENV DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"

RUN  npm run prisma:docker

EXPOSE 3001 

CMD ["npm","run","start"]
