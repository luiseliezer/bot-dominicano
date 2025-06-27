const playdl = require('play-dl');
const fs = require('fs');
const path = require('path');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');

module.exports = async function (sock, m, from, senderId, args) {
  try {
    const query = args.join(' ');
    if (!query) {
      return sock.sendMessage(from, {
        text: '📥 Escribe el nombre de la canción o pega un link de YouTube.\nEj: `.play me porto bonito` o `.play https://youtu.be/...`',
      }, { quoted: m });
    }

    let videoUrl;
    let videoInfo;

    if (playdl.yt_validate(query) === 'video') {
      videoUrl = query;
      videoInfo = await playdl.video_info(videoUrl);
    } else {
      const search = await playdl.search(query, { limit: 1 });
      if (!search.length || !search[0].url) {
        return sock.sendMessage(from, {
          text: '❌ No encontré ese tema, manito. Prueba con otro 🎶',
        }, { quoted: m });
      }
      videoUrl = search[0].url;
      videoInfo = await playdl.video_info(videoUrl);
    }

    if (!videoInfo || !videoInfo.video_details || !videoUrl) {
      return sock.sendMessage(from, {
        text: '⚠️ No pude obtener el link del video. Intenta con otro nombre o link válido.',
      }, { quoted: m });
    }

    const { stream } = await playdl.stream_from_info(videoInfo);
    const filePath = path.join(os.tmpdir(), `${videoInfo.video_details.id}.webm`);

    await sock.sendMessage(from, {
      text: `🎧 *Reproduciendo:* ${videoInfo.video_details.title}\n⏱️ Duración: ${videoInfo.video_details.durationRaw}`,
    }, { quoted: m });

    ffmpeg(stream)
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

        fs.unlinkSync(filePath);
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




