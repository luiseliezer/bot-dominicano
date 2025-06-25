module.exports = async (sock, msg, from, senderId, args) => {
    try {
        await sock.sendMessage(from, { text: '🏓 ¡Pong! El bot ta activo, mi loco.' });
        console.log(`[CMD] .ping ejecutado por ${senderId}`);
    } catch (error) {
        console.error(`[ERROR] al ejecutar .ping:`, error);
    }
};
