FROM docker:24

WORKDIR /app

COPY . .

RUN apk add --no-cache docker-compose

CMD ["docker-compose","up"]