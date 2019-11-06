# Build the Go API
FROM golang:latest AS builder
ADD . /app
WORKDIR /app/server
ENV https_proxy socks5://10.1.1.233:1080
RUN git config --global http.sslVerify false
RUN go get github.com/labstack/echo
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .
# Build the React application
FROM node:alpine AS node_builder
COPY --from=builder /app/client ./
RUN yarn install
RUN yarn run build
# Final stage build, this will be the container
# that we will deploy to production
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder /main ./
COPY --from=node_builder /build ./web
RUN chmod +x ./main
EXPOSE 8080
CMD ./main