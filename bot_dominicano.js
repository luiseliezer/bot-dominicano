const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { readdirSync } = require('fs');
const path = require('path');
const P = require('pino');
const qrcode = require('qrcode-terminal');
const config = require('./config/config');

async function connectBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: true, // Puedes quitar esta línea si quieres evitar el warning
        auth: state
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            console.log('📲 Escanea este QR con tu WhatsApp:');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'open') {
            console.log('✅ Bot conectado exitosamente');
        } else if (connection === 'close') {
            console.log('❌ Conexión cerrada. Reintentando...');
            connectBot();
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Cargar comandos desde la carpeta
    const comandos = {};
    const comandosDir = path.join(__dirname, 'comandos');
    readdirSync(comandosDir).forEach(file => {
        const nombre = file.replace('.js', '');
        comandos[nombre] = require(path.join(comandosDir, file));
    });

    // Manejo de mensajes entrantes
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || !msg.key.remoteJid) return;

        const from = msg.key.remoteJid;
        const senderId = msg.key.participant || msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        if (!text.startsWith('.')) return;

        const [comando, ...args] = text.trim().split(' ');
        const accion = comando.slice(1).toLowerCase();

        // Comando especial: .activar
        if (accion === 'activar') {
            const admin = '18294662330@s.whatsapp.net';

            if (senderId !== admin) {
                await sock.sendMessage(from, { text: '🚫 Solo el dueño del bot puede activar comandos 🔒' });
                return;
            }

            if (!args[0]) {
                await sock.sendMessage(from, { text: '❗ Escribe el comando a activar. Ej: .activar play' });
                return;
            }

            const ok = config.activarComando(args[0].toLowerCase());

            await sock.sendMessage(from, {
                text: ok
                    ? `✅ Comando .${args[0]} activado pa’ to’ el mundo`
                    : `❌ No encontré el comando .${args[0]}`
            });
            return;
        }

        // Comando especial: .desactivar
        if (accion === 'desactivar') {
            const admin = '18294662330@s.whatsapp.net';

            if (senderId !== admin) {
                await sock.sendMessage(from, { text: '🚫 Solo el dueño del bot puede desactivar comandos 🔒' });
                return;
            }

            if (!args[0]) {
                await sock.sendMessage(from, { text: '❗ Escribe el comando a desactivar. Ej: .desactivar play' });
                return;
            }

            const ok = config.desactivarComando(args[0].toLowerCase());

            await sock.sendMessage(from, {
                text: ok
                    ? `🛑 Comando .${args[0]} desactivado correctamente`
                    : `❌ No encontré el comando .${args[0]}`
            });
            return;
        }

        // Comandos normales
        if (comandos[accion]) {
            const acceso = config.verificarAcceso(accion, from);
            if (!acceso) {
                await sock.sendMessage(from, { text: '🚫 Ese comando no ta’ disponible pa’ ti, manín.' });
                return;
            }

            try {
                await comandos[accion](sock, msg, from, senderId, args);
                console.log(`[CMD] .${accion} ejecutado por ${senderId}`);
            } catch (err) {
                console.error(`[ERROR] al ejecutar .${accion}:`, err);
                await sock.sendMessage(from, { text: '❌ Algo falló, pero no te apures, que seguimos rulay 🔧' });
            }
        }
    });
}

connectBot();


