ARG GO_VERSION=1
FROM golang:${GO_VERSION}-bookworm as builder

WORKDIR /usr/src/app
COPY backend/go.mod backend/go.sum ./
RUN go mod download && go mod verify
COPY backend/ .
RUN go build -v -o /run-app .


FROM debian:bookworm

COPY --from=builder /run-app /usr/local/bin/
COPY backend/static/ /usr/src/app/static/
WORKDIR /usr/src/app
CMD ["run-app"]
