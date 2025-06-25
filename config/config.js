let comandosActivos = {
    ping: true,
    menu: true,
    saludo: true,
    sticker: true,
    tigre: true,
    ayuda: true,
    chill: true,
    invocar: true,
    configuracion: true
};

const verificarAcceso = (comando, chatId) => {
    return comandosActivos[comando] ?? false;
};

const activarComando = (comando) => {
    if (comandosActivos.hasOwnProperty(comando)) {
        comandosActivos[comando] = true;
        return true;
    }
    return false;
};

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


