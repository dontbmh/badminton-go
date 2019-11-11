# Build the Go API
FROM golang:latest AS go_builder
ADD . /app
WORKDIR /app/server
# ENV https_proxy socks5://10.1.1.233:1080
RUN git config --global http.sslVerify false
RUN go get github.com/labstack/echo
RUN go get github.com/labstack/echo/middleware
RUN go get gopkg.in/mgo.v2
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .
# Build the React application
FROM node:alpine AS node_builder
COPY --from=go_builder /app/client ./
RUN yarn install
RUN yarn run build
# Final stage build, this will be the container
# that we will deploy to production
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=go_builder /main ./
COPY --from=node_builder /build ./static
RUN chmod +x ./main
EXPOSE 8080
CMD ./main