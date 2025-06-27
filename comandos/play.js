const playdl = require('play-dl');
const fs = require('fs');
const path = require('path');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');

module.exports = async function(sock, m, from, senderId, args) {
  try {
    const query = args.join(' ');
    if (!query) {
      return sock.sendMessage(from, {
        text: '📥 Escribe el nombre de la canción o pega un link de YouTube. Ej: .play Mi gente o .play https://youtube.com/...',
      }, { quoted: m });
    }

    let videoInfo;

    // Si es un link directo de YouTube
    if (playdl.yt_validate(query) === 'video') {
      videoInfo = await playdl.video_info(query);
    } else {
      // Si es un nombre o frase para buscar
      const search = await playdl.search(query, { limit: 1 });
      if (!search.length) {
        return sock.sendMessage(from, {
          text: '❌ No encontré ese tema, manito. Prueba con otro 🎶',
        }, { quoted: m });
      }
      videoInfo = await playdl.video_info(search[0].url);
    }

    const stream = await playdl.stream(videoInfo.video_details.url, { quality: 1 });
    const filePath = path.join(os.tmpdir(), `${videoInfo.video_details.id}.webm`);

    // Envia mensaje de previsualización
    await sock.sendMessage(from, {
      text: `🎧 *Tamo ready:* ${videoInfo.video_details.title}\n\n⏱️ Duración: ${videoInfo.video_details.durationRaw}`,
    }, { quoted: m });

    // Convierte el audio y lo manda
    ffmpeg(stream.stream)
      .audioCodec('libvorbis')
      .noVideo()
      .format('webm')
      .save(filePath)
      .on('end', async () => {
        await sock.sendMessage(from, {
          audio: { url: filePath },
          mimetype: 'audio/webm',
          ptt: true
        }, { quoted: m });

        fs.unlinkSync(filePath); // Limpieza
      })
      .on('error', (err) => {
        console.error('🎙️ Error con FFmpeg:', err);
        sock.sendMessage(from, {
          text: '❌ No pude convertir la canción. Intenta con otra.',
        }, { quoted: m });
      });

  } catch (err) {
    console.error('🚨 Error en .play:', err);
    await sock.sendMessage(from, {
      text: '❌ Fallé descargando la música. Tira otro nombre y probamos otra vez 🔁',
    }, { quoted: m });
  }
};


