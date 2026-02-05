import { emitirTexto, selecionarCanal } from "./socket-front.js";


const parametros = new URLSearchParams(window.location.search);
const nomeDocumento = parametros.get('name') || 'Documento Sem Nome';

const canalgeral = document.getElementById('canalgeral');
canalgeral.addEventListener('click', () => {
    console.log('Canal Geral selecionado');
    selecionarCanal(canalgeral.id);
});
const canaltech = document.getElementById('canaltech');
canaltech.addEventListener('click', () => {
    console.log('Canal Tech selecionado');
    selecionarCanal(canaltech.id);
});
const canalrandom = document.getElementById('canalrandom');
canalrandom.addEventListener('click', () => {
    console.log('Canal Random selecionado');
    selecionarCanal(canalrandom.id);
});

//Alterar data do id timebot
const timebot = document.getElementById('timebot');
const agora = new Date();
const horas = String(agora.getHours()).padStart(2, '0');
const minutos = String(agora.getMinutes()).padStart(2, '0');
timebot.textContent = `${horas}:${minutos}`;


const textarea = document.getElementById('large-textarea');
const sendButton = document.getElementById('send-button');
sendButton.addEventListener('click', () => {
    emitirTexto(textarea.value);
    textarea.value = '';
});
        
// const textarea = document.getElementById('large-textarea');
// textarea.addEventListener("keyup", () => {
//     emitirTexto(textarea.value);
// });

const textMsg = document.getElementById('chat-history');
export function atualizarTexto(texto) {
    textMsg.innerHTML = texto;
}