import { Socket } from "net";
import { MaindBoard_Type, Module_Type, ReaderType } from "../enums";
import { reader } from "../hardwareDetails";
import { socketWriteWithResponse } from "../helpers/socketWriteWithResponse";
import { clientSocket, tcpClientSocket } from "../app";
import { startReading } from "./startReading";
import { connectReader } from "../helpers/connectReader";
import { wait } from "../helpers/wait";
import { printResponseInHex } from "../helpers/printResponseInHex";
import { redis } from "../libs/redis";

export const establishConnection = async (client: Socket) => {

    const buffer = Buffer.from([0xff, 0x0e, 0xaa, 0x4d, 0x6f, 0x64, 0x75, 0x6c, 0x65, 0x74, 0x65, 0x63, 0x68, 0xaa, 0x49, 0xf3, 0xbb]);

    const numArray = await socketWriteWithResponse(buffer, { wait: true, appendCrcToInput: true }).catch((err) => {
        client.destroy()
        return null
    })
    if (!numArray)
        return

    reader.hardwareDetails.module = Module_Type.MODOULE_NONE;
    reader.hardwareDetails.logictype = ReaderType.MT_TWOANTS;
    reader.hardwareDetails.selfcheckants = 0;

    const mainBoardTypeResBuffer = await socketWriteWithResponse(Buffer.from([0x49, 0x4f, 0x47]), { wait: true, appendCrcToInput: true });

    if (mainBoardTypeResBuffer[0] === 73 && mainBoardTypeResBuffer[1] === 79 && mainBoardTypeResBuffer[2] === 71 && mainBoardTypeResBuffer[3] === 69 && mainBoardTypeResBuffer[4] === 84)
        reader.hardwareDetails.board = MaindBoard_Type.MAINBOARD_ARM7;
    mainBoardTypeResBuffer[2]

    if (reader.hardwareDetails.board === 1) {

        const res = await socketWriteWithResponse(Buffer.from([0xff, 0x00, 0x03,]), { wait: true, appendCrcToInput: true });

        const num4 = res[1]

        let type: number;

        if (res[12] === 128) {
            let newBuf = await socketWriteWithResponse(Buffer.from([0xff, 0x00, 0x05, 0x1d, 0x0a]), { wait: true, appendCrcToInput: true })
            let check = Buffer.from([newBuf[25], newBuf[26], newBuf[27], newBuf[28], newBuf[29], newBuf[9], newBuf[10], newBuf[11], newBuf[12], newBuf[13]])
            if (check[0] === 177) {

                reader.hardwareDetails.logictype = ReaderType.MT_ONEANT;

                if (check[7]) {
                    reader.hardwareDetails.module = Module_Type.MODOULE_SFM2100;
                    reader.hardwareDetails.selfcheckants = 1;

                    if (reader.hardwareDetails.module === Module_Type.MODOULE_SFM2100) {
                        type = ReaderType.MT_A7_TWOANTS
                    }
                }
                reader.specAntsCnt = 1;

            }

        }


        client.destroy();
        await wait(10)
        connectReader(client)



        const err = await socketWriteWithResponse(Buffer.from([255, 250]), { wait: true }).catch((err) => err);

        if (err !== "close")
            return

        connectReader(client)

        await socketWriteWithResponse(Buffer.from([0x49, 0x4f, 0x47, 0x45, 0x54]), { wait: true })
        await socketWriteWithResponse(Buffer.from([0x49, 0x4f, 0x47, 0x45, 0x54]), { wait: true })

        await socketWriteWithResponse(Buffer.from([0xff, 0x00, 0x04, 0x1d, 0x0b]), { wait: true })

        await socketWriteWithResponse(Buffer.from([0xff, 0x01, 0x61, 0x05, 0xbd, 0xb8]), { wait: true })
        await socketWriteWithResponse(Buffer.from([0xff, 0x03, 0x9a, 0x01, 0x08, 0x00, 0xa7, 0x5d]), { wait: true })
        await socketWriteWithResponse(Buffer.from([0xff, 0x03, 0x9a, 0x01, 0x00, 0x01, 0xaf, 0x5c]), { wait: true })
        await socketWriteWithResponse(Buffer.from([0xff, 0x01, 0x65, 0x02, 0xb9, 0xbf]), { wait: true })
        await socketWriteWithResponse(Buffer.from([0x56, 0x45, 0x52]), { wait: true })

        await socketWriteWithResponse(Buffer.from([0xff, 0x01, 0x62, 0x01, 0xbe, 0xbc]), { wait: true })
        await socketWriteWithResponse(Buffer.from([0xff, 0x01, 0x62, 0x01, 0xbe, 0xbc]), { wait: true })
        await socketWriteWithResponse(Buffer.from([0xff, 0x02, 0x6a, 0x01, 0x00, 0x2e, 0x4e]), { wait: true })
        await socketWriteWithResponse(Buffer.from([0xff, 0x02, 0x6a, 0x01, 0x08, 0x2e, 0x46]), { wait: true })
        await socketWriteWithResponse(Buffer.from([0xff, 0x01, 0x61, 0x03, 0xbd, 0xbe]), { wait: true })
        await socketWriteWithResponse(Buffer.from([0xff, 0x01, 0x61, 0x05, 0xbd, 0xb8]), { wait: true })
        const readerDetails = await socketWriteWithResponse(Buffer.from([0xFF, 0x02, 0x10, 0x00, 0x00,]), { wait: true, appendCrcToInput: true })
        const readerYearModel = Number(Array.from(readerDetails.subarray(5, 9)).join(""));
        const serialNumber = Array.from(readerDetails.subarray(9, 17)).join("")

        const prop = { readerYearModel, serialNumber, address: "Sialkot", connectionStatus: "connected" }
        return prop

    }
}