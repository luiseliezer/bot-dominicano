const { activarComando } = require('../config/config');

module.exports = async (sock, msg, from, senderId, args) => {
    const comando = args[0]?.toLowerCase();
    if (!comando) {
        await sock.sendMessage(from, { text: '❗ Escribe qué comando quieres activar. Ej: *.activar chill*' });
        return;
    }

    const ok = activarComando(comando);
    const texto = ok
        ? `✅ El comando *.${comando}* fue ACTIVADO, mi loco.`
        : `❌ Ese comando no existe o no puede ser activado.`;

    await sock.sendMessage(from, { text: texto });
};
