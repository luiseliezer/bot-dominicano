const playdl = require('play-dl');
const fs = require('fs');
const path = require('path');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');

module.exports = async function(sock, m, query) {
  try {
    const search = await playdl.search(query, { limit: 1 });
    if (search.length === 0) {
      return await sock.sendMessage(m.key.remoteJid, {
        text: '❌ No encontré ese tema, manito. Inténtalo con otro nombre 🎧',
      }, { quoted: m });
    }

    const video = search[0];
    const stream = await playdl.stream(video.url, { quality: 1 });
    const tempAudio = path.join(os.tmpdir(), `${video.id}.webm`);

    ffmpeg(stream.stream)
      .audioCodec('libvorbis')
      .noVideo()
      .format('webm')
      .save(tempAudio)
      .on('end', async () => {
        await sock.sendMessage(m.key.remoteJid, {
          text: `🎶 *Reproduciendo:* ${video.title}`,
        }, { quoted: m });

        await sock.sendMessage(m.key.remoteJid, {
          audio: { url: tempAudio },
          mimetype: 'audio/webm',
          ptt: true
        }, { quoted: m });

        fs.unlinkSync(tempAudio);
      })
      .on('error', (err) => {
        console.error('🎙️ Error con FFmpeg:', err);
        sock.sendMessage(m.key.remoteJid, {
          text: '❌ No pude convertir la canción. Intenta con otra.',
        }, { quoted: m });
      });

  } catch (e) {
    console.error('🚨 Error en .play:', e);
    await sock.sendMessage(m.key.remoteJid, {
      text: '❌ Fallé descargando la música. Tira otro nombre y probamos otra vez 🔁',
    }, { quoted: m });
  }
};

