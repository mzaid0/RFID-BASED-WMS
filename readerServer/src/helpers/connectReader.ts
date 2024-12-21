import { Socket } from "net";
import { establishConnection } from "../utilts/establishConnection";

export const connectReader = async (socket: Socket) => {

    const RFID_READER_IP = '192.168.1.100';
    const RFID_READER_PORT = 8080;

    await new Promise((resolve, reject) => {
        socket.connect(8080, '192.168.1.100', () => {


        });
        function removeListener() {
            socket.removeListener("connect", onConnect)
            socket.removeListener("error", onError)
        }
        function onConnect() {
            console.log(`Connected to RFID reader at ${RFID_READER_IP}:${RFID_READER_PORT}`);
            removeListener()
            resolve(true)
        }
        function onError(err: Error) {
            removeListener()
            reject("Error while connecting to RFID reader: " + err.message)
        }
        socket.once("connect", onConnect)
        socket.once("error", onError)
    })

}