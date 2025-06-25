module.exports = async (sock, msg, from, senderId, args) => {
    const tipo = msg.message?.imageMessage || msg.message?.videoMessage;

    if (!tipo) {
        await sock.sendMessage(from, {
            text: '📸 Mándame una foto o video, loco. Yo te lo devuelvo en sticker rulay.'
        });
        return;
    }

    try {
        const buffer = await sock.downloadMediaMessage(msg);
        await sock.sendMessage(from, {
            sticker: buffer,
            stickerAuthor: 'BotDominicano',
            stickerName: 'RulayPack'
        });

        await sock.sendMessage(from, {
            text: '🔥 Mira ese sticker… ta bacanísimo, manín!'
        });

        console.log(`[CMD] .sticker ejecutado por ${senderId}`);
    } catch (error) {
        console.error(`[ERROR] al ejecutar .sticker:`, error);
    }
};
