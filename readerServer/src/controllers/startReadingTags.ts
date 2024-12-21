import { Request, Response } from "express";
import { startReading } from "../utilts/startReading";
import { tcpClientSocket } from "../app";
import { socketWriteWithResponse } from "../helpers/socketWriteWithResponse";
import { printResponseInHex } from "../helpers/printResponseInHex";

export const startReadingTags = async (req: Request, res: Response) => {
    try {
        await startReading();
        res.status(200).json({ message: "Reading started." });




        // Chapter 5.5.1 Asynchronous inventory (0xAA48)

        // Send command:
        // Header   Data-length     Command code        Subcommand Marker (Moduletech)          Sub Command Code  
        // ff	    13		        AA		            4D 6F 64 75 6C 65 74 65 63 68           AA 48

        // Metadata Flags       Option      Search Flags     Sub CRC        Terminator      CRC
        // 00 9f	            00		    08 03		     34             BB              29 04


        // Receive Command:
        // Header  Data length  	Command Code 	Sub command maker (Moduletech)          Sub command code        CRC
        // FF	   00		        AA		        4D 6F 64 75 6C 65 74 65 63 68           AA 48                   0f 23

        // purpose: Initiate async inventory



        const initAsyncInvenSenCmd = Buffer.from([0xff, 0x13, 0xaa, 0x4d, 0x6f, 0x64, 0x75, 0x6c, 0x65, 0x74, 0x65, 0x63, 0x68, 0xaa, 0x48, 0x00, 0x9f, 0x00, 0x80, 0x00, 0x11, 0xbb, 0x0b, 0x22]);
        await socketWriteWithResponse(initAsyncInvenSenCmd, {
            onDataCb: async (data) => {
                printResponseInHex(data)


            }
        })
    } catch (error) {

    }
}