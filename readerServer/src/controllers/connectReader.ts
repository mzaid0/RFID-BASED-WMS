import { Request, Response } from "express"
import { clientSocket, tcpClientSocket } from "../app"
import { connectReader } from "../helpers/connectReader"
import { establishConnection } from "../utilts/establishConnection"
import { redis } from "../libs/redis";





export const connectReaderContoller = async (req: Request, res: Response) => {
    try {
        const connectionStatus = await redis.get("connection-status")

        if (connectionStatus === "connected")
            return res.status(200).json({ message: "connection already there" })


        else {

            await redis.set("connection-status", "connected")

            await connectReader(tcpClientSocket);

            const prop = await establishConnection(tcpClientSocket);
            
            await redis.set("connection-status", "connected")
            
            await clientSocket.emit("reader-connected", prop);

            res.status(200).json({ message: "connection successful" })

        }

    } catch (error) {
        res.status(500).json({ message: "Could not connect to reader." })
    }
}