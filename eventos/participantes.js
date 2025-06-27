module.exports = function (sock) {
  sock.ev.on('group-participants.update', async (update) => {
    try {
      const metadata = await sock.groupMetadata(update.id);
      const groupName = metadata.subject;

      for (const participant of update.participants) {
        const username = participant.split('@')[0];
        let profilePic;

        try {
          profilePic = await sock.profilePictureUrl(participant, 'image');
        } catch {
          profilePic = './media/default.png'; // Imagen de respaldo si no tiene perfil
        }

        if (update.action === 'add') {
          // 🎉 Bienvenida
          await sock.sendMessage(update.id, {
            image: { url: './media/bienvenida.png' },
            caption: `🎉 @${username} se unió al *${groupName}*.\n\n🔥 *Bienvenid@ al corillo mi loc@,* ponte cómod@, preséntate y tira tu primera línea. Aquí se goza 😎`,
            mentions: [participant]
          });
        }

        if (update.action === 'remove') {
          const isKicked = update.by && update.by !== participant;

          if (isKicked) {
            // 👢 Expulsado
            await sock.sendMessage(update.id, {
              image: { url: './media/expulsado.png' },
              caption: `👢 @${username} fue *expulsado* del grupo *${groupName}*.\n\n🥥 *Esa no son brisa que tumban coco* 💨`,
              mentions: [participant]
            });
          } else {
            // 👋 Se fue solito
            await sock.sendMessage(update.id, {
              image: { url: './media/salida.png' },
              caption: `👋 @${username} abandonó el grupo *${groupName}*.\n\n🙏 *Vaya con Dios mi loc@,* pero sigue derechito... que el GPS no tiene regreso 😅`,
              mentions: [participant]
            });
          }
        }
      }
    } catch (err) {
      console.error('⚠️ Error en bienvenida/despedida:', err);
    }
  });
};

