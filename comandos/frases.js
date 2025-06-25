const fs = require('fs');
const path = require('path');

module.exports = async (sock, msg, from, senderId, args) => {
    const grupoId = from;
    const ruta = path.join(__dirname, `../data/${grupoId}.json`);

    if (!fs.existsSync(ruta)) {
        await sock.sendMessage(from, {
            text: '😕 Este grupo aún no tiene frases. Agrega una con *.agregarfrase Tu frase aquí*.'
        });
        return;
    }

    const frases = JSON.parse(fs.readFileSync(ruta, 'utf8'));

    if (!frases.length) {
        await sock.sendMessage(from, {
            text: '📭 No hay frases registradas. Empieza con *.agregarfrase*'
        });
        return;
    }

    let mensaje = '📚 *Frases guardadas del grupo:*\n\n';
    frases.forEach((frase, i) => {
        mensaje += `${i + 1}. ${frase}\n`;
    });

    await sock.sendMessage(from, { text: mensaje });
};
