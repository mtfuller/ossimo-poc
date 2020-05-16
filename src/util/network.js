const net = require('net');

/**
 * Returns a promise that resolves to a free port number.
 */
export function getRandomPort() {
    return new Promise((resolve, reject) => {
        try {
            const server = net.createServer();

            server.on('listening', () => {
                const port = server.address().port;
                server.close();
                resolve(port)
            });

            server.on('error', (err) => {
                reject(err);
            })

            server.listen(0);
        } catch (error) {
            reject("error here")
        }
    });
}