const net = require('net');
import logger from '../util/logger';

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
            console.error("ERROR:")
            console.error(err);
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
            logger.debug('opened server on', this.server.address());
        });
    }
}

export class IPCClient {
    constructor(port) {
        this.host = '127.0.0.1'
        this.port = port;
    }

    request(_data, connectionName="connection") {
        return new Promise((resolve, reject) => {
            const dataStr = JSON.stringify(_data)

            var client = new net.Socket();
            client.connect(this.port, this.host, () => {
                logger.debug(`${connectionName} | Connected`);
                client.write(dataStr);
            });
    
            client.on('data', (data) => {
                const _data = JSON.parse(data.toString());
                logger.debug(`${connectionName} | Received: ` + _data);
                client.destroy(); // kill client after server's response
                resolve(_data)
            });

            client.on('error', (err) => {
                logger.error(`${connectionName} | Could not connect to server at ${this.host}:${this.port}`);
                reject(err);
            });
    
            client.on('close', () => {
                logger.debug(`${connectionName} | Connection closed`);
                resolve()
            });
        });
    }
}