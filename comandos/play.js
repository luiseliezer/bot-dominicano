const fs = require('fs');
const os = require('os');
const path = require('path');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const ffmpeg = require('fluent-ffmpeg');

module.exports = async function(sock, m, query) {
  try {
    const res = await yts(query);
    const video = res.videos[0];
    if (!video) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ No encontré ese video, manito. Prueba con otro nombre 🎵',
      }, { quoted: m });
      return;
    }

    const tempMp4 = path.join(os.tmpdir(), `${video.videoId}.mp4`);
    const tempWebm = path.join(os.tmpdir(), `${video.videoId}.webm`);

    const stream = ytdl(video.url, {
      filter: 'audioandvideo',
      quality: 'lowestvideo'
    });
    const writeStream = fs.createWriteStream(tempMp4);
    stream.pipe(writeStream);

    writeStream.on('finish', () => {
      ffmpeg(tempMp4)
        .outputOptions([
          '-vf', 'scale=360:360:force_original_aspect_ratio=decrease',
          '-c:v', 'libvpx',
          '-an',
          '-crf', '30',
          '-b:v', '600k',
        ])
        .save(tempWebm)
        .on('end', async () => {
          await sock.sendMessage(m.key.remoteJid, {
            text: '🔊 *Klk!* Aquí está tu musiquita que me pediste 🎶',
          }, { quoted: m });

          await sock.sendMessage(m.key.remoteJid, {
            video: { url: tempWebm },
            mimetype: 'video/webm',
            ptt: true
          }, { quoted: m });

          fs.unlinkSync(tempMp4);
          fs.unlinkSync(tempWebm);
        })
        .on('error', (err) => {
          console.error('Error con FFmpeg:', err);
        });
    });

  } catch (e) {
    console.error('Error en el comando .play:', e);
    await sock.sendMessage(m.key.remoteJid, {
      text: '❌ Ocurrió un problema descargando la musiquita. Inténtalo de nuevo.',
    }, { quoted: m });
  }
};

