import express from "express";
import { Server } from "socket.io";
import url from "url";
import path from "path";
import http from "http";

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

export default io;