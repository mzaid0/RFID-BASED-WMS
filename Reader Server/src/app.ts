import * as net from 'net';
import express, { Request, Response } from 'express';
import { connectReaderContoller } from './controllers/connectReader';
import { disconnectReader } from './controllers/disconnectReader';
import { Server as SocketServer } from "socket.io"
import http from 'http';
import { socketIoRegister } from './registers/socketIoRegister';
import { io } from "socket.io-client"
const app = express()

export const tcpClientSocket = new net.Socket();

const httpServer = http.createServer();
io()
const socketIo = new SocketServer(httpServer, {
    cors: {
        origin: "*", // Allow all origins for development
        methods: ["GET", "POST"]
    }
});
socketIoRegister(socketIo)
const port = process.env.PORT || 2000;

app.get("/api/connect-reader", connectReaderContoller);
app.get("/api/disconnect-reader", disconnectReader);

tcpClientSocket.on('error', (err) => {
    console.error('Error occurred:', err.message);
});

tcpClientSocket.on('close', () => {
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