import express from "express";
import { Server } from "socket.io";
import url from "url";
import path from "path";
import http from "http";
import "../src/model/connectMongo.js";
import { collectionDb } from "../src/model/connectMongo.js";
import { perguntarIA } from "./connectIA.js";
// import { atualizarTexto } from "../public/index.js";

const app = express();

const caminhoAtual = url.fileURLToPath(import.meta.url);
const diretorioPublico = path.join(caminhoAtual, "../..", "public");
console.log(diretorioPublico);
app.use(express.static(diretorioPublico));

const servidorHttp = http.createServer(app);

servidorHttp.listen(8095, () =>
    console.log('Servidor escutando na porta 8095')
);

const io = new Server(servidorHttp);
let canalEscolhido = [];

async function historicoCanal(canal) {
    const historico = await collectionDb.findOne({ canal: canal });
    return historico;
}

async function atualizaChat(canal, novoChat) {
    const chatAtual = await historicoCanal(canal);
    if(chatAtual) {
        novoChat = chatAtual.chat + novoChat;
    }
    const resultado = await collectionDb.updateOne({ canal }, { $set: { chat: novoChat } });
    return resultado;
}

io.on("connection", (socket) => {
    console.log("Um cliente se conectou! ID:", socket.id);

    socket.on('select-channel', async (canal, bkpchat) => {
        console.log(`Cliente selecionou o canal: ${canal}`);
        socket.join(canal);
        // console.info('canalEscolhido.includes(canal)');
        // console.info(canalEscolhido.find((item) => {
        //     return item.canal === canal;
        // }));
        const validCanalBySocketId = canalEscolhido.find((item) => {
            return item.idSocket === socket.id;
        });
        if(!validCanalBySocketId) {
            canalEscolhido.push(
                {
                    canal,
                    idSocket: socket.id
                }
            );
        }

        if(canal == validCanalBySocketId?.canal) {
            const historico = await historicoCanal(validCanalBySocketId.canal);
            if(historico) {
                console.info("Retorno do historico canal");
                // socket.to(canalEscolhido).emit("text-backend", texto);
                bkpchat(historico.chat);
            }
            return;
        }
        
        if(canal != validCanalBySocketId?.canal){
            canalEscolhido.pop(validCanalBySocketId?.idSocket);
            canalEscolhido.push(
                {
                    canal,
                    idSocket: socket.id
                }
            );
        }
        
        console.log('canalEscolhido');
        console.log(canalEscolhido);
        const historico = await historicoCanal(canal);
        console.info("Retorno do historico canal novo");
        // const resultado = await atualizaChat(canalEscolhido, bkpchat);
        // socket.to(canalEscolhido).emit("text-backend", texto);
        if(historico) {
            // socket.to(canalEscolhido).emit("text-backend", texto);
            bkpchat(historico.chat);
        }

    });

    socket.on('text-backend', async (texto) => {
        const resultado = await atualizaChat(canalEscolhido[0]['canal'],
            `<div class="message">
                <div class="message-header">
                    <span class="username">Danilo</span>
                    <span class="time">${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="message-body">
                    ${texto}
                </div>
            </div>`);
        console.log("Atualização do chat no canal:", canalEscolhido[0]['canal']);
        // socket.to(canalEscolhido).emit("text-backend", texto);
        if( resultado.modifiedCount) {
            console.info("Emissão do texto para o canal escolhido");
            const historico = await historicoCanal(canalEscolhido[0]['canal']);
            io.to(canalEscolhido[0]['canal']).emit("text-front", historico.chat);
            // atualizarTexto(texto);
        }

        const result = await perguntarIA(texto);
        const resultadoIA = await atualizaChat(canalEscolhido[0]['canal'],
            `<div class="message ia-message">
                <div class="message-header">
                    <span class="username">IA Bot</span>
                    <span class="time">${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="message-body">
                    ${result}
                </div>
            </div>`);
        if( resultadoIA.modifiedCount) {
            console.info("Emissão do texto para o canal escolhido");
            const historico = await historicoCanal(canalEscolhido[0]['canal']);
            io.to(canalEscolhido[0]['canal']).emit("text-front", historico.chat);
            // atualizarTexto(texto);
        }
        // socket.broadcast.emit("text-backend", texto);
        
    });

    // socket.on("disconnect", (motivo) => {
    //     console.log(`Servidor desconectado!
    //     Motivo: ${motivo}`);
    // });
    
});



export default io;
