import { IPCServer, IPCClient } from './Transport';
import { exec } from 'child_process';

const StatusEnum = Object.freeze({
    STOPPED:"STOPPED",
    STARTING:"STARTING",
    RUNNING:"RUNNING",
    ERROR:"ERROR",
    ABORTED:"ABORTED"
});

export class Deployment {
    constructor(name, command, deploymentDir) {
        this.name = name;
        this.command = command;
        this.deploymentDir = deploymentDir;
        this.status = StatusEnum.STOPPED;
        this.process = null;
    }

    getStatus() {
        return this.status;
    }

    start() {
        console.log(`Starting ${this.name}...`)
        this.status = StatusEnum.STARTING;
        this.process = exec(this.command, {cwd:this.deploymentDir}, (error, stdout, stderr) => {
            this.status = StatusEnum.RUNNING;

            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
        this.status = StatusEnum.RUNNING;
    }

    abort() {
        
    }
}

export class OssimoOrchestrator {
    constructor(port) {
        this.port = port;

        this.deployments = {};

        this.server = new IPCServer(this.port);
        this.server.on('status', (req) => {
            const statusInfo = [];
            console.log(this.deployments);
            for (const deploymentName in this.deployments) {
                const deployment = this.deployments[deploymentName];

                const deploymentStatus = {
                    name: deployment.name,
                    status: deployment.getStatus()
                };

                statusInfo.push(deploymentStatus);
            }
            return statusInfo;
        }).on('deploy', (req) => {
            const deployment = new Deployment(
                req.name,
                req.command,
                req.deploymentDir
            );

            this.deploy(deployment);

            const deploymentStatus = {
                name: deployment.name,
                status: deployment.getStatus()
            };
            return deploymentStatus;
        });
    }

    deploy(deployment) {
        this.deployments[deployment.name] = deployment;
        console.log(this.deployments);
        deployment.start();
    }

    start() {
        this.server.start();
    }
}

export class OssimoOrchestratorClient {
    constructor(port) {
        this.port = port;

        this.client = new IPCClient(this.port);
    }

    async getStatus() {
        let response = null;

        try {
            response = await this.client.request({
                action: "status"
            });
        } catch (e) {
            throw new Error("Could not get status. Server running?")
        }

        return response;
    }

    async deploy(name, command, deploymentDir) {
        let response = null;

        try {
            response = await this.client.request({
                action: "deploy",
                name: name,
                command: command,
                deploymentDir: deploymentDir
            });
        } catch (e) {
            throw new Error("Could not deploy. Server running?")
        }

        return response;
    }
}