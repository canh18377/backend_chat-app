const WebSocket = require('ws');
const config_websoket = (server) => {
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
        console.log('A client connected');

        ws.send('Hello from WebSocket server!');

        ws.on('message', (message) => {
            console.log('Received: ' + message);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
}
module.exports = config_websoket 