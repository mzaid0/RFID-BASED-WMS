import { printResponseInHex } from "./printResponseInHex";


const MSG_CRC_INIT = 0xFFFF;
const MSG_CCITT_CRC_POLY = 0x1021;

function CRC_calcCrc8(crcReg: number, u8Data: number): number {
    let dcdBitMask = 0x80;
    for (let i = 0; i < 8; i++) {
        const xorFlag = (crcReg & 0x8000) !== 0;
        crcReg <<= 1;
        const bit = (u8Data & dcdBitMask) === dcdBitMask;

        crcReg |= bit ? 1 : 0;
        if (xorFlag) {
            crcReg ^= MSG_CCITT_CRC_POLY;
        }
        dcdBitMask >>= 1;
    }
    return crcReg & MSG_CRC_INIT; // Ensure CRC is a 16-bit value
}

export function calculateCrc(msgbuf: Buffer) {
    let calcCrc = MSG_CRC_INIT;

    // Process each byte in the message buffer
    for (let i = 1; i < msgbuf.length; i++) {
        calcCrc = CRC_calcCrc8(calcCrc, msgbuf[i]);
    }

    const highByte = (calcCrc & 0xFF00) >> 8; // Extract high byte
    const lowByte = calcCrc & 0x00FF;        // Extract low byte

    const crcBuffer = Buffer.from([highByte, lowByte]);

    const updatedBuffer = Buffer.concat([msgbuf, crcBuffer]);


    return updatedBuffer; 
}