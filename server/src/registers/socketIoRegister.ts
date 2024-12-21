import { Server as SocketServer } from "socket.io"
import { redis } from "../utils/redis"
import { readerConnected } from "../socket-events/reader-connected"


export const socketIoRegister = (baseIo: SocketServer) => {
    try {


        baseIo.on("connection", async (socket) => {
            socket.on("reader-connected", async (prop) => await readerConnected(baseIo, socket, prop))
        })
    } catch (error) {
        console.log(`error occurred while socketing error:${error}`)
    }
}