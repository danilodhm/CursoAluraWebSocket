import { atualizarTexto } from ".";
import io from "../src/servidor";

const socket = io();

function emitirTexto(texto) {
    socket.emit('texto-editor', texto);
}

socket.on('text-client', (texto) => {
    console.log("Texto recebido do servidor:", texto);
    atualizarTexto(texto);
});

export { emitirTexto };