import { Server as SocketServer } from "socket.io"


export const socketIoRegister = (baseIo: SocketServer) => {
    try {


        baseIo.on("connection", async (socket) => {

        })
    } catch (error) {
        console.log(`error occurred while socketing error:${error}`)
    }
}