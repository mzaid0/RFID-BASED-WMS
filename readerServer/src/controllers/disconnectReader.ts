import { Request, Response } from "express"
import { clientSocket, tcpClientSocket } from "../app"
import { wait } from "../helpers/wait"
import { socketWriteWithResponse } from "../helpers/socketWriteWithResponse"
import { redis } from "../libs/redis"

export const disconnectReader = async (req: Request, res: Response) => {
    try {
        const connectionStatus = await redis.get("connection-status")

        if (connectionStatus === "disconnected")
            return res.status(200).json({ message: "Reader already disconnected." })
        else {
            await socketWriteWithResponse(Buffer.from([0x00]), { wait: true, }).catch((err) => "disconnected")

            const readerDetails = await socketWriteWithResponse(Buffer.from([0xFF, 0x02, 0x10, 0x00, 0x00,]), { wait: true, appendCrcToInput: true });

            const readerYearModel = Number(Array.from(readerDetails.subarray(5, 9)).join(""));
            const serialNumber = Array.from(readerDetails.subarray(9, 17)).join("")

            const prop = { readerYearModel, serialNumber, address: "Sialkot", connectionStatus: "disconnected" }
            clientSocket.emit("reader-disconnected", prop)
            tcpClientSocket.destroy();
            await redis.set("connection-status", "disconnected")
            await wait(300)
            res.status(200).json({ message: "Reader disconnected." })
        }

    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}