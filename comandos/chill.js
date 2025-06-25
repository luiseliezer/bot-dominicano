const fs = require('fs');
const path = require('path');

module.exports = async (sock, msg, from, senderId, args) => {
    const carpeta = path.join(__dirname, '../media/chill/');
    const archivos = fs.readdirSync(carpeta);

    if (archivos.length === 0) {
        await sock.sendMessage(from, { text: '😕 No hay chill pa’ soltar aún.' });
        return;
    }

    const archivoElegido = archivos[Math.floor(Math.random() * archivos.length)];
    const ruta = path.join(carpeta, archivoElegido);
    const extension = path.extname(archivoElegido).toLowerCase();

    if (['.mp3', '.ogg', '.wav'].includes(extension)) {
        await sock.sendMessage(from, {
            audio: { url: ruta },
            mimetype: 'audio/mpeg',
            ptt: true
        });
    } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(extension)) {
        await sock.sendMessage(from, {
            image: { url: ruta },
            caption: '🧊 Chill mode activao 🧠'
        });
    } else {
        await sock.sendMessage(from, { text: `❌ Formato no soportado: ${extension}` });
    }
};
