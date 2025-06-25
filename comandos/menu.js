module.exports = async (sock, msg, from, senderId, args) => {
    const textoMenu = `
🇩🇴 *Bot Dominicano al servicio del corito* 🇩🇴
Aquí tan to' los comandos que tú puedes usar:

🔊 *.play <canción>* — Búscate un dembow o lo que tú quieras en YouTube.
👥 *.invocar* — Llama a to' los tígueres del grupo.
🏓 *.ping* — Pa’ chequear si el bot ta rulay.
📸 *.sticker* — Mándame una foto o video, y te saco el sticker al toque.
🎤 *.saludo* — Te tiro un “qué lo qué” pa’ encender la vuelta.
🧃 *.tigre* — Suelto una frase dominicana al azar, pa’ motivar.
🛋️ *.chill* — Te lanzo un meme bacano pa’ que te relajes.
🆘 *.ayuda* — Una explicación de cada comando en lenguaje de calle.

*Recuerda:* Los comandos van con punto alante (`.comando`), no te me equivoques 🔧  
_Y si tienes dudas, tírame un .ayuda y resolvemos al pasito._

💬 *Bot Dominicano*, siempre activo, nunca inactivo. 🚀
`;

    try {
        await sock.sendMessage(from, { text: textoMenu });
        console.log(`[CMD] .menu ejecutado por ${senderId}`);
    } catch (error) {
        console.error(`[ERROR] al ejecutar .menu:`, error);
    }
};
