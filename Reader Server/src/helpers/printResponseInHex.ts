export const printResponseInHex = (response: Buffer): void => {
    // Convert the entire Buffer to a hex string
    const hexString = response.toString('hex').toUpperCase(); // toUpperCase for uppercase hex

    // Split the hex string into 2-character chunks and display as '0xXX' format
    const formattedHex = hexString.match(/.{1,2}/g)?.map(byte => `0x${byte}`).join(', ');

    if (formattedHex) {
        console.log(formattedHex); // Logs in the form: 0xFF, 0x54, 0x05, etc.
    } else {
        console.log('Error in formatting the response');
    }
};