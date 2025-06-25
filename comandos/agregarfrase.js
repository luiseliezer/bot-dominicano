const fs = require('fs');
const path = require('path');

module.exports = async (sock, msg, from, senderId, args) => {
    const texto = args.join(' ').trim();
    if (!texto) {
        await sock.sendMessage(from, { text: '📌 Escribe una frase. Ej: *.agregarfrase El coro no se rinde.*' });
        return;
    }

    const grupoId = from;
    const ruta = path.join(__dirname, `../data/${grupoId}.json`);
    let frases = [];

    if (fs.existsSync(ruta)) {
        frases = JSON.parse(fs.readFileSync(ruta, 'utf8'));
    }

    frases.push(texto);
    fs.writeFileSync(ruta, JSON.stringify(frases, null, 2));

    await sock.sendMessage(from, {
        text: '✅ Frase agregada al repertorio del grupo 😎'
    });
};
