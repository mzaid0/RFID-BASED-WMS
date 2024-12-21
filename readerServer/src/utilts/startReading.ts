import { printResponseInHex } from "../helpers/printResponseInHex";
import { socketWriteWithResponse } from "../helpers/socketWriteWithResponse"


export const startReading = async () => {
    // Chapter 8.2 Get frequency hopping settings (0x65)


    // Send command:
    // Header  Data-length     Command code     CRC
    // ff	    00		        65		        1D 6A


    // Receive Command:
    // Header  Data length  	Command Code 	Status Code	    915250KHZ	    903250KHZ	    926750KHZ	    CRC
    // FF	    0c		        65		        00 00		    00 0D F9 26	    00 0D C8 52	    00 0E 24 1E	    f5 20

    // note: each set of 4 bytes between status code and CRC represents a frequency in Hz

    // purpose: The command is used to get the frequency hopping table
    const getFreqHoppSettSenCmd = Buffer.from([0xff, 0x00, 0x65, 0x1D, 0x6A]);

    const getFreqHoppSettReCmd = await socketWriteWithResponse(getFreqHoppSettSenCmd, { wait: true })

    console.log(4)

    // XXXXXXXXXXXXXChapter 8.3 Set frequency hopping settings (0x66)XXXXXXXXXXXXXXXXXXXXXXX

    // Chapter  8.6 Get Reader Configuration (0x6A)

    // Send command:
    // Header  Data-length     Command code     Option      Key	        CRC
    // ff	   02		       6a		        01          00          2E 4E

    // Receive Command:
    // Header  Data length  	Command Code 	Status Code	    Option	    Key     Value	    CRC
    // FF	   03		        6A		        00 00		    01	        00	    01          3E 45

    // purpose:set Key=00 and value =01 to, use the antenna port as the unique identifiers for tag buffer entries
    // note: default value for key=00 is 01, so it is not in send command
    const setAntPortIdentifierSenCmd = Buffer.from([0xff, 0x02, 0x6a, 0x01, 0x00, 0x2E, 0x4E]);
    const setAntPortIdentifierReceCmd = await socketWriteWithResponse(setAntPortIdentifierSenCmd, { wait: true })
    console.log(5)



    // Send command:
    // Header  Data-length     Command code     Option      Key	        CRC
    // ff	   02		       6a		        01          08          2E 46

    // Receive Command:
    // Header  Data length  	Command Code 	Status Code	    Option	    Key     Value	    CRC
    // FF	   03		        6A		        00 00		    01	        08	    00          36 44

    // purpose: set Key=08 to and value = 00, use bank data as the unique identifiers for tag buffer entries
    // note: default value for key=08 is 00, so it is not in send command

    const setBandDataAsIdentitySenCmd = Buffer.from([0xff, 0x02, 0x6a, 0x01, 0x08, 0x2E, 0x46]);

    const setBandDataAsIdentityRecCmd = await socketWriteWithResponse(setBandDataAsIdentitySenCmd, { wait: true })
    console.log(6)

    // Send command:
    // Header  Data-length     Command code     Option      Key	        CRC
    // ff	   02		       6a		        01          06          2E 48

    // Receive Command:
    // Header  Data length  	Command Code 	Status Code	    Option	    Key     Value	    CRC
    // FF	   03		        6A		        00 00		    01	        06	    00          38 44

    // purpose: set Key=06 to, set the recording the maximum RSSI (Received Signal Strength Indicator) value that has been seen
    // note: default value for key=06 is 00, so it is not in send command

    const setRecMaxRssiValSenCmd = Buffer.from([0xff, 0x02, 0x6a, 0x01, 0x06, 0x2E, 0x48]);

    const setRecMaxRssiValRecCmd = await socketWriteWithResponse(setRecMaxRssiValSenCmd, { wait: true })

    console.log(7)



    // Chapter 7.1 Set the antenna port (0x91)
    //   01 01 42 c5

    // Send command:
    // Header  Data-length     Command code     Option      TX Logical Antenna Number       RX Logical Antenna Number	    CRC
    // ff	   03		       91		        02          01                              01                              42 C5

    // Receive Command:
    // Header  Data length  	Command Code 	Status Code     CRC
    // FF	   00		        91		        00 00		    17 58

    // purpose: set antenna port

    const setAntPortSenCmd = Buffer.from([0xff, 0x03, 0x91, 0x02, 0x01, 0x01, 0x42, 0xc5]);

    const setAntPortRecCmd = await socketWriteWithResponse(setAntPortSenCmd, { wait: true })

    console.log(8)

}



async function stopAsyncInventory() {
    // Chapter 5.5.3 Stop Asynchronous inventory (0xAA49)

    // Send command:
    // Header   Data-length     Command code        Subcommand Marker (Moduletech)          Sub Command Code    SubCRC      Terminator      CRC
    // ff	    0e	            AA		            4D 6F 64 75 6C 65 74 65 63 68           AA 49               f3          BB              03 91

    // Receive Command:
    // Header  Data length  	Command Code 	Sub command maker (Moduletech)          Sub command code        CRC
    // FF	   00		        AA		        4D 6F 64 75 6C 65 74 65 63 68           AA 49                   0f 22

    // purpose: Stop async inventory

    const stopAsyncInventorySenCmd = Buffer.from([0xff, 0x0e, 0xAA, 0x4D, 0x6F, 0x64, 0x75, 0x6C, 0x65, 0x74, 0x65, 0x63, 0x68, 0xAA, 0x49, 0xf3, 0xBB, 0x03, 0x91])
    const stopAsyncInventoryRecCmd = await socketWriteWithResponse(stopAsyncInventorySenCmd, { wait: true })

}