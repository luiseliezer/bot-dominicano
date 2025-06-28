const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { readdirSync } = require('fs');
const path = require('path');
const P = require('pino');
const qrcode = require('qrcode-terminal');
const config = require('./config/config');

// Lista de admins (puedes agregar más)
const ADMINS = [
    '18294328201@s.whatsapp.net'
];

async function connectBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
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
    require('./eventos/participantes')(sock);

    const comandos = {};
    const comandosDir = path.join(__dirname, 'comandos');
    readdirSync(comandosDir).forEach(file => {
        const nombre = file.replace('.js', '');
        comandos[nombre] = require(path.join(comandosDir, file));
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || !msg.key.remoteJid) return;

        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const senderId = isGroup ? msg.key.participant : msg.key.remoteJid;

        console.log('👤 senderId real:', senderId);

        // Ignora direcciones anómalas como @lid
        if (!senderId.endsWith('@s.whatsapp.net') && !senderId.endsWith('@g.us')) {
            console.log(`⚠️ Sesión no válida: ${senderId}`);
            return;
        }

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        if (!text.startsWith('.')) return;

        const [comando, ...args] = text.trim().split(' ');
        const accion = comando.slice(1).toLowerCase();

        if (accion === 'activar') {
            if (!ADMINS.includes(senderId)) {
                await sock.sendMessage(from, { text: '🚫 Solo los dueños del bot pueden activar comandos 🔒' });
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

        if (accion === 'desactivar') {
            if (!ADMINS.includes(senderId)) {
                await sock.sendMessage(from, { text: '🚫 Solo los dueños del bot pueden desactivar comandos 🔒' });
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

        // Comandos normales con control de acceso
        if (comandos[accion]) {
            const acceso = config.verificarAcceso(accion, from);
            if (!acceso) {
                await sock.sendMessage(from, { text: "🚫 Ese comando no ta' disponible pa' ti, manín." });
                return;
            }

            try {
                await comandos[accion](sock, msg, from, senderId, args);
                console.log(`[CMD] .${accion} ejecutado por ${senderId}`);
            } catch (err) {
                console.error(`[ERROR] al ejecutar .${accion}:`, err);
                if (err.message.includes('No sessions')) {
                    console.log(`🔐 Usuario sin sesión válida: ${senderId}`);
                    return;
                }
                await sock.sendMessage(from, { text: '❌ Algo falló, pero seguimos rulay 🔧' });
            }
        }
    });
}

connectBot();


