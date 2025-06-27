// Archivo: config.js

let comandosActivos = {
    ping: true,
    menu: true,
    saludo: true,
    sticker: true,
    tigre: true,
    ayuda: true,
    chill: true,
    invocar: true,
    configuracion: true,
    play: true // ✅ Agregado manualmente para permitir el comando `.play`
};

// Verifica si el comando está activo
// Si no se ha definido explícitamente, devuelve true por defecto (útil en desarrollo)
const verificarAcceso = (comando, chatId) => {
    if (!comandosActivos.hasOwnProperty(comando)) return true;
    return comandosActivos[comando];
};

// Activa un comando existente en la lista
const activarComando = (comando) => {
    if (comandosActivos.hasOwnProperty(comando)) {
        comandosActivos[comando] = true;
        return true;
    }
    return false;
};

// Desactiva un comando existente en la lista
const desactivarComando = (comando) => {
    if (comandosActivos.hasOwnProperty(comando)) {
        comandosActivos[comando] = false;
        return true;
    }
    return false;
};

module.exports = {
    comandosActivos,
    verificarAcceso,
    activarComando,
    desactivarComando
};

