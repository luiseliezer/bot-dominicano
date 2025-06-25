const { desactivarComando } = require('../config/config');

module.exports = async (sock, msg, from, senderId, args) => {
    const comando = args[0]?.toLowerCase();
    if (!comando) {
        await sock.sendMessage(from, { text: '❗ Escribe qué comando quieres desactivar. Ej: *.desactivar sticker*' });
        return;
    }

    const ok = desactivarComando(comando);
    const texto = ok
        ? `🚫 El comando *.${comando}* fue DESACTIVADO, manito.`
        : `❌ Ese comando no existe o no puede ser desactivado.`;

    await sock.sendMessage(from, { text: texto });
};
