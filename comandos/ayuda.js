module.exports = async (sock, msg, from, senderId, args) => {
    const ayuda = `
🆘 *Centro de Ayuda del Bot Dominicano* 🇩🇴

Aquí te explico con manzanas lo que hace cada comando:

🏓 *.ping* → Pa’ verificar si el bot está prendido.  
🔊 *.play <nombre>* → Reproduce una canción desde YouTube.  
👥 *.invocar* → Menciona a todos en el grupo (sin pena).  
📸 *.sticker* → Envía una imagen o video y se convierte en sticker.  
🎤 *.saludo* → Te mando un “qué lo qué” en nota de voz.  
🧃 *.tigre* → Tiro una frase con flow del patio.  
🛋️ *.chill* → Te relajo con un meme o sticker sorpresa.  
📜 *.menu* → Vuelve a mostrar el menú con todos los comandos.  
🆘 *.ayuda* → Este mismo mensaje que estás leyendo.

*Tips del tíguere:*  
- Siempre usa el punto alante (ej: *.ping*)  
- Si el bot no responde, espéralo… a veces se pone en modo “motoconcho lento”.  
- Pa’ más comandos, espérate que le sigamos metiendo 🔥

_Bot Dominicano, al servicio del barrio._  
`;

    try {
        await sock.sendMessage(from, { text: ayuda });
        console.log(`[CMD] .ayuda ejecutado por ${senderId}`);
    } catch (error) {
        console.error(`[ERROR] al ejecutar .ayuda:`, error);
    }
};
