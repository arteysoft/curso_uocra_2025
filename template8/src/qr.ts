const QRCode = require('qrcode');
const fs = require('fs')

async function testear() {
        const qrDataUrl = await QRCode.toDataURL("ANDO DE 10");
        const qrBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
        const qrImage = qrBytes;

        fs.writeFileSync("c:\\qrs\\hola.jpg", qrBytes);
}

testear();
