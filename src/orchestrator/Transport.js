const net = require('net');

export class IPCServer {
    constructor(port) {
        this.port = port
        this.actions = {};

        this.server = net.createServer((socket) => {
            socket.on('data', (data) => {
                const req = JSON.parse(data.toString());

                const response = this.handleRequest(req);
                const preparedResponse = JSON.stringify(response);

                socket.end(preparedResponse);
            });
        }).on('error', (err) => {
            throw err;
        });
    }

    on(actionName, callback) {
        if (this.actions.hasOwnProperty(actionName)) {
            throw new Error(`The action ${actionName} is already defined`);
        }

        this.actions[actionName] = callback

        return this;
    }

    handleRequest(req) {
        if (!this.actions.hasOwnProperty(req.action)) {
            throw new Error(`Their is no action named ${req.action}`);
        }

        return this.actions[req.action](req);
    }

    start() {
        this.server.listen(this.port, '127.0.0.1', () => {
            console.log('opened server on', this.server.address());
        });
    }
}

export class IPCClient {
    constructor(port) {
        this.port = port;
    }

    request(_data) {
        return new Promise((resolve, reject) => {
            const dataStr = JSON.stringify(_data)

            var client = new net.Socket();
            client.connect(this.port, '127.0.0.1', function() {
                console.log('Connected');
                client.write(dataStr);
            });
    
            client.on('data', function(data) {
                const _data = JSON.parse(data.toString());
                console.log('Received: ' + _data);
                client.destroy(); // kill client after server's response
                resolve(_data)
            });
    
            client.on('close', function() {
                console.log('Connection closed');
                resolve()
            });
        });
    }
}