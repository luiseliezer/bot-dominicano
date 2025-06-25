module.exports = async (sock, msg, from, senderId, args) => {
    const metadata = await sock.groupMetadata(from).catch(() => null);
    if (!metadata) {
        await sock.sendMessage(from, {
            text: '🚫 Este comando solo sirve en grupos, mi loco.'
        });
        return;
    }

    const miembros = metadata.participants.map(part => ({
        tag: `@${part.id.split('@')[0]}`,
        id: part.id
    }));

    const texto = '🗣️ *KLK MI GENTE LINDA, BELLA Y HERMOSA* ✨' +
        '\n🎮 ¡Vamos a jugar tan lento que ni el lag nos alcanza!' +
        '\n\n' +
        miembros.map(m => m.tag).join(' ');

    try {
        await sock.sendMessage(from, {
            text: texto,
            mentions: miembros.map(m => m.id)
        });
        console.log(`[CMD] .invocar ejecutado por ${senderId}`);
    } catch (error) {
        console.error(`[ERROR] al ejecutar .invocar:`, error);
    }
};
