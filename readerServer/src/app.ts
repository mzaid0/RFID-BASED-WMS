import * as net from 'net';
import express, { Request, Response } from 'express';
import { connectReaderContoller } from './controllers/connectReader';
import { disconnectReader } from './controllers/disconnectReader';
import { Server as SocketServer } from "socket.io"
import http from 'http';
import { socketIoRegister } from './registers/socketIoRegister';
import { io } from "socket.io-client"
import { redis } from './libs/redis';
const app = express()

export const tcpClientSocket = new net.Socket();
export const clientSocket = io("http://localhost:4000")
clientSocket.on("connect", async () => {
    console.log("reader server connected to remote server")
})
const httpServer = http.createServer();

const port = Number(process.env.PORT) || 2000;

app.get("/api/connect-reader", connectReaderContoller);
app.get("/api/disconnect-reader", disconnectReader);

tcpClientSocket.on('error', (err) => {
    console.error('Error occurred:', err.message);
});

tcpClientSocket.on('close', async () => {
    await redis.set("connection-status", "disconnected")
    console.log('Connection to RFID reader closed.');
});

tcpClientSocket.on('timeout', () => {
    console.log('Connection timed out.');
});

const server = app.listen(port, () => {
    console.log(`app running on port ${port}`)
});

process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});