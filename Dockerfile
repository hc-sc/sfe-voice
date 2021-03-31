FROM node:12.20.1

RUN npm i -g jovo-cli

WORKDIR /app

COPY ./package* ./

RUN npm i

COPY ./botsociety ./botsociety
COPY ./img ./img

RUN cd /app

CMD [ "jovo", "run", "-w" ]