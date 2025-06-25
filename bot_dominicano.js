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
        printQRInTerminal: false,
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
