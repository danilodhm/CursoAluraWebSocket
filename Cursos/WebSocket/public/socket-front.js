import { atualizarTexto } from "./index.js";

const socket = io();

export function emitirTexto(texto) {
    socket.emit('text-backend', texto);
}

export function selecionarCanal(canal) {
    socket.emit('select-channel', canal, (historico) => {
        console.log(`Histórico do canal ${canal} recebido via callback: ${historico}`);
        atualizarTexto(historico);
    });
}

// socket.on('text-historico', (texto) => {
//     console.log("Histórico recebido do servidor:", texto);
//     atualizarTexto(texto);
// });

socket.on('text-front', (texto) => {
    console.log("Texto recebido do servidor:", texto);
    atualizarTexto(texto);
});
