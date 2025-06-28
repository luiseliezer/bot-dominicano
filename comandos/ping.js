module.exports = async (sock, msg, from, senderId, args) => {
    // ⛔ Protección contra contactos anómalos como @lid o @broadcast
    if (!senderId.endsWith('@s.whatsapp.net') && !senderId.endsWith('@g.us')) {
        console.warn(`⛔ .ping ignorado por sesión inválida: ${senderId}`);
        return;
    }

    try {
        await sock.sendMessage(from, { text: '🏓 ¡Pong! El bot ta activo, mi loco.' });
        console.log(`[CMD] .ping ejecutado por ${senderId}`);
    } catch (error) {
        if (
            error.message?.includes('not-acceptable') ||
            error.message?.includes('No sessions')
        ) {
            console.warn(`⛔ Error de sesión inválida al responder a ${senderId}`);
            return;
        }

        console.error(`[ERROR] al ejecutar .ping:`, error);
        await sock.sendMessage(from, { text: '❌ Ocurrió un fallo con el ping, pero seguimos rulay.' });
    }
};
