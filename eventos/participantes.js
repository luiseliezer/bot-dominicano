if (update.action === 'add') {
  await sock.sendMessage(update.id, {
    image: { url: './media/bienvenida.png' },
    caption: `🎉 @${username} se unió al *${groupName}*.\n\n🔥 *Bienvenid@ al corillo mi loc@,* ponte cómod@, preséntate y tira tu primera línea. Aquí se goza 😎`,
    mentions: [participant]
  });
}

if (update.action === 'remove') {
  const isKicked = update.by && update.by !== participant;

  if (isKicked) {
    await sock.sendMessage(update.id, {
      image: { url: './media/expulsado.png' },
      caption: `👢 @${username} fue *expulsado* del grupo *${groupName}*.\n\n🥥 *Esa no son brisa que tumban coco* 💨`,
      mentions: [participant]
    });
  } else {
    await sock.sendMessage(update.id, {
      image: { url: './media/salida.png' },
      caption: `👋 @${username} abandonó el grupo *${groupName}*.\n\n🙏 *Vaya con Dios mi loc@,* pero sigue derechito... que el GPS no tiene regreso 😅`,
      mentions: [participant]
    });
  }
}

