import { Server as SocketServer } from "socket.io"
import { redis } from "../utils/redis";

type Props = {
    readerYearModel: number;
    serialNumber: string;
    address: string;
}
export const readerConnected = async (baseIo: SocketServer, socket: Socket, props: Props) => {
    redis.set(`reader:${props.serialNumber}`, JSON.stringify(props))
}