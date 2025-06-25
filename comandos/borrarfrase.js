const fs = require('fs');
const path = require('path');

module.exports = async (sock, msg, from, senderId, args) => {
    const index = parseInt(args[0]) - 1;
    const grupoId = from;
    const ruta = path.join(__dirname, `../data/${grupoId}.json`);

    if (isNaN(index)) {
        await sock.sendMessage(from, {
            text: '❗ Usa el número de la frase. Ej: *.borrarfrase 3*'
        });
        return;
    }

    if (!fs.existsSync(ruta)) {
        await sock.sendMessage(from, {
            text: '📭 No hay frases registradas todavía.'
        });
        return;
    }

    let frases = JSON.parse(fs.readFileSync(ruta, 'utf8'));

    if (index < 0 || index >= frases.length) {
        await sock.sendMessage(from, {
            text: '🚫 Ese número no corresponde a ninguna frase.'
        });
        return;
    }

    const eliminada = frases.splice(index, 1);
    fs.writeFileSync(ruta, JSON.stringify(frases, null, 2));

    await sock.sendMessage(from, {
        text: `🗑️ Frase eliminada:\n"${eliminada[0]}"`
    });
};
