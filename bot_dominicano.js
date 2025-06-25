const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const { readdirSync } = require('fs');
const path = require('path');
const P = require('pino');
const qrcode = require('qrcode-terminal');
const config = require('./config/config');

// Reemplaza esto con TU número en formato internacional sin símbolos
const NUMERO_NOTIFICACION = '1XXXXXXXXXX@s.whatsapp.net'; // <-- pon tu número aquí

let sock;

async function connectBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state
    });

    sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log('📲 Escanea este QR con tu WhatsApp:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log('✅ Bot conectado exitosamente');
            await sock.sendMessage(NUMERO_NOTIFICACION, { text: '🟢 El bot se reconectó rulay ✅' });
        } else if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const mensajeError = lastDisconnect?.error?.message || 'Desconocido';

            console.warn(`[❌] Bot desconectado (${statusCode}) - ${mensajeError}`);

            if (statusCode !== DisconnectReason.loggedOut) {
                await sock.sendMessage(NUMERO_NOTIFICACION, { text: '🔴 El bot perdió conexión. Intentando reconectar...' });
                setTimeout(connectBot, 3000);

