const socket = io();

const textarea = document.getElementById('large-textarea');

textarea.addEventListener('keyup', () => {
    socket.emit('texto-editor', textarea.value);
});