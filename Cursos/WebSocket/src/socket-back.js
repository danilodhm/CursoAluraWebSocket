import io from "./servidor.js";

console.info(io)
io.on("connection", (socket) => {
    console.log("Um cliente se conectou! ID:", socket.id);

    
    socket.on('text-backend', (texto) => {
        console.log(texto);
        socket.broadcast.emit("text-backend", texto);
    });

    
    socket.on("disconnect", (motivo) => {
        console.log(`Servidor desconectado!
        Motivo: ${motivo}`);
    });
});

