const path = require('path');

module.exports = async (sock, msg, from, senderId, args) => {
    try {
        const audioPath = path.join(__dirname, '../media/que_lo_que.mp3');

        await sock.sendMessage(from, {
            audio: { url: audioPath },
            mimetype: 'audio/mpeg',
            ptt: true // esto lo envía como nota de voz
        });

        console.log(`[CMD] .saludo ejecutado por ${senderId}`);
    } catch (error) {
        console.error(`[ERROR] al ejecutar .saludo:`, error);
    }
};
