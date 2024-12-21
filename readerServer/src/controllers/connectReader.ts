import { Request, Response } from "express"
import { tcpClientSocket } from "../app"
import { connectReader } from "../helpers/connectReader"
import { establishConnection } from "../utilts/establishConnection"
import { redisClient } from "../libs/redis";
export let readerConnected = false;



export const setReaderConnected = (value: boolean) => readerConnected = value;


export const connectReaderContoller = async  (req: Request, res: Response) => {
    try {
        if (readerConnected)
            return res.status(200).json({ message: "connection already there" })
        else {
            setReaderConnected(true)
            await connectReader(tcpClientSocket)
            await establishConnection(tcpClientSocket)

            res.status(200).json({ message: "connection successful" })
        }

    } catch (error) {
        res.status(500).json({ message: "Could not connect to reader." })
    }
}