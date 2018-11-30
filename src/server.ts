import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();

const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const consoles = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {

    ws.on('close', () => {
        if (consoles.has(ws)) {
            consoles.delete(ws);
        }
    });

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
        consoles.forEach(consoleWs => {
            consoleWs.send(message);
        });
        if(message==='console') {
            consoles.add(ws);
        }
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});


//start our server
server.listen(process.env.PORT || 8999, () => {
    // const  port  = (wss.address() as WebSocket.AddressInfo).port;
    const { port } = wss.address() as WebSocket.AddressInfo;
    console.log(`Server started on port ${port} :)`);
});