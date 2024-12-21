import { Request, Response } from "express"
import { tcpClientSocket } from "../app"
import { connectReader } from "../helpers/connectReader"
import { establishConnection } from "../utilts/establishConnection"
import { readerConnected, setReaderConnected } from "./connectReader"
import { wait } from "../helpers/wait"
import { socketWriteWithResponse } from "../helpers/socketWriteWithResponse"

export const disconnectReader = async (req: Request, res: Response) => {
    try {
        console.log("disconnecting")
        if (readerConnected === false)
            return res.status(200).json({ message: "Reader already disconnected." })
        else {
            await socketWriteWithResponse(Buffer.from([0x00]), { wait: true, }).catch((err) => "disconnected")
            tcpClientSocket.destroy()
            setReaderConnected(false);
            await wait(300)
            res.status(200).json({ message: "Reader disconnected." })
        }

    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}