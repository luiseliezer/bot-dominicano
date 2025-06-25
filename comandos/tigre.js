module.exports = async (sock, msg, from, senderId, args) => {
    const frases = [
        'Tamo activo y rulay 🔥',
        '¡Mi loco, tú ere’ de los míos! 💯',
        'Más bacano que plátano con salami 🇩🇴',
        'Ese comando ta prendido como el 12 de diciembre 🔥',
        'Tú ta tan duro que haces sombra de noche 😎'
    ];

    const random = frases[Math.floor(Math.random() * frases.length)];

    try {
        await sock.sendMessage(from, { text: random });
        console.log(`[CMD] .tigre ejecutado por ${senderId}`);
    } catch (error) {
        console.error(`[ERROR] al ejecutar .tigre:`, error);
    }
};
