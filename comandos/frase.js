const fs = require('fs');
const path = require('path');

module.exports = async (sock, msg, from, senderId, args) => {
    const grupoId = from;
    const ruta = path.join(__dirname, `../data/${grupoId}.json`);

    let frases = [];

    if (fs.existsSync(ruta)) {
        const data = fs.readFileSync(ruta, 'utf8');
        frases = JSON.parse(data);
    }

    if (frases.length === 0) {
        await sock.sendMessage(from, {
            text: '😔 No hay frases aún. Agrega una con *.agregarfrase Tu frase aquí*.'
        });
        return;
    }

    const aleatoria = frases[Math.floor(Math.random() * frases.length)];
    await sock.sendMessage(from, {
        text: `🧠 *Frase del Grupo:* \n\n${aleatoria}`
    });
};

