import { tcpClientSocket } from "../app";
import { printResponseInHex } from "./printResponseInHex";
import { calculateCrc } from "./checksum";

type Props = {
    errorMessage?: string;
    appendCrcToInput?: boolean;
} & ({ wait: boolean } |
{ onDataCb?: (data: Buffer) => void })

export const socketWriteWithResponse = async (buffer: Buffer<ArrayBuffer>, prop: Props) => {

    if (prop.appendCrcToInput) {
        const newBuffer = calculateCrc(buffer);
        tcpClientSocket.write(newBuffer);
    } else
        tcpClientSocket.write(buffer);

    let responseBufferArray = Buffer.alloc(0);

    await new Promise(async (resolve, reject) => {
        function removeListeners() {
            tcpClientSocket.removeListener('data', onData);
            tcpClientSocket.removeListener('error', onError);
            tcpClientSocket.removeListener("close", onClose);
        }
        if ("wait" in prop && prop.wait === false) {
            removeListeners()
            resolve(true)
        }

        async function onData(data: Buffer) {
            responseBufferArray = data;

            if ("wait" in prop && !("onDataCb" in prop)) {
                removeListeners()
                resolve(true)
            } else if (prop?.onDataCb && typeof prop.onDataCb === "function") {
                const stop = await prop.onDataCb(data)
                if (stop) {
                    resolve(true)
                    removeListeners()
                }
            }
        }

        function onError(err: Error) {
            removeListeners()
            reject(prop?.errorMessage || err.message)
            console.error(prop?.errorMessage || err.message);
        }
        function onClose() {
            removeListeners()
            reject("close")
        }
        tcpClientSocket.on('data', onData);
        tcpClientSocket.on('error', onError);
        tcpClientSocket.on("close", onClose);

    })
    return responseBufferArray

}


// const readAllFromSocket = async (buffer: Buffer, offset: number, count: number): Promise<number> => {

//     const readChunk = async (accumulated: number): Promise<number> => {
//         console.log(1)
//         if (accumulated >= count)
//             return accumulated;
//         console.log(2)

//         return new Promise<number>((resolve, reject) => {
//             console.log(3)
//             socket.on('data', (data) => {
//                 console.log(data)
//                 const bytesToCopy = Math.min(data.length, count - accumulated);
//                 data.copy(buffer, offset + accumulated, 0, bytesToCopy);
//                 resolve(accumulated + bytesToCopy);
//             });

//             socket.once('error', reject);
//         }).then(readChunk);
//     };
//     console.log("readAllFromSocket")
//     return readChunk(0);
// };
