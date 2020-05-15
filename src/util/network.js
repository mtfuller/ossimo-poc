const net = require('net');

export function getRandomPort() {
    return new Promise((resolve, reject) => {
        try {
            const server = net.createServer();

            server.on('listening', () => {
                console.log("PORT FOUND!")
                const port = server.address().port;
                console.log(port)
                console.log("Closing server...")
                server.close();
                console.log("Server closed.")

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