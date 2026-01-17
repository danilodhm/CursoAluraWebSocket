import { emitirTexto } from "./socket-front";

const socket = io();

const textarea = document.getElementById('large-textarea');

textarea.addEventListener('keyup', () => {
    emitirTexto(textarea.value);
});

function atualizarTexto(texto) {
    textarea.value = texto;
}

export { atualizarTexto };