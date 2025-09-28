ARG GO_VERSION=1
FROM golang:${GO_VERSION}-bookworm as builder

WORKDIR /usr/src/app
COPY backend/go.mod backend/go.sum ./
RUN go mod download && go mod verify
COPY backend/ .
RUN go build -v -o /run-app .

FROM debian:bookworm

# Copy the Go binary
COPY --from=builder /run-app /usr/local/bin/

# Copy the React build files directly
COPY build/ /usr/src/app/static/

# Set working directory where static files are expected
WORKDIR /usr/src/app

CMD ["run-app"]