module.exports = async (sock, msg, from, senderId, args) => {
    const groupMetadata = await sock.groupMetadata(from);
    const participantes = groupMetadata.participants;

    const getPais = (numero) => {
        if (numero.startsWith('212')) return { flag: '🇲🇦', nombre: 'Marruecos' };
        if (numero.startsWith('52')) return { flag: '🇲🇽', nombre: 'México' };
        if (numero.startsWith('57')) return { flag: '🇨🇴', nombre: 'Colombia' };
        if (numero.startsWith('58')) return { flag: '🇻🇪', nombre: 'Venezuela' };
        if (numero.startsWith('55')) return { flag: '🇧🇷', nombre: 'Brasil' };
        if (numero.startsWith('54')) return { flag: '🇦🇷', nombre: 'Argentina' };
        if (numero.startsWith('34')) return { flag: '🇪🇸', nombre: 'España' };
        if (numero.startsWith('51')) return { flag: '🇵🇪', nombre: 'Perú' };
        if (numero.startsWith('1')) return { flag: '🇩🇴', nombre: 'República Dominicana' };
        return { flag: '🌐', nombre: 'Desconocido' };
    };

    const paises = {};

    for (const p of participantes) {
        const jid = p.id || p.jid;
        if (jid === senderId) continue;

        const numero = jid.split('@')[0];
        const { flag, nombre } = getPais(numero);

        if (!paises[nombre]) {
            paises[nombre] = { flag, menciones: [], jids: [] };
        }

        paises[nombre].menciones.push(`${flag} @${numero}`);
        paises[nombre].jids.push(jid);
    }

    let texto = '*📢 Invocando al coro internacional:*\n\n';
    let allMentions = [];

    for (const nombre in paises) {
        const { flag, menciones, jids } = paises[nombre];
        texto += `*${flag} ${nombre}:*\n${menciones.join('\n')}\n\n`;
        allMentions = allMentions.concat(jids);
    }

    texto += `👥 Total invocados: *${allMentions.length}*`;

    await sock.sendMessage(from, {
        text: texto.trim(),
        mentions: allMentions
    });
};
