import { IPCServer, IPCClient } from './Transport';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { copyEntireDirectory, removeExistingDirectoryTree } from '../util/fs-util';
import Environment from './Environment';
import { getRandomPort } from '../util/network';

var COUNT = 8080;

const StatusEnum = Object.freeze({
    STOPPED:"STOPPED",
    STARTING:"STARTING",
    RUNNING:"RUNNING",
    ERROR:"ERROR",
    ABORTED:"ABORTED"
});

export class Deployment {
    constructor(name, platform, deploymentDir, project) {
        this.name = name;
        this.platform = require(`../platforms/${platform}`);
        this.deploymentDir = deploymentDir;
        this.project = project;
        this.status = StatusEnum.STOPPED;
        this.process = null;
    }

    getStatus() {
        return this.status;
    }

    start() {
        try {
            console.log(`Starting ${this.name}...`)
            this.status = StatusEnum.STARTING;
            const deployer = new this.platform.Deployer();
            deployer.setDir(this.deploymentDir)
            deployer.run((error, stdout, stderr) => {
                
                    this.status = StatusEnum.RUNNING;

                    if (error) {
                        this.status = StatusEnum.ERROR;
                        console.error(`exec error: ${error}`);
                        return;
                    }
        
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);


            });
            this.status = StatusEnum.RUNNING;
        } catch (e) {
            console.error(e);
        }
    }

    abort() {
        
    }
}

export class OssimoOrchestrator {
    constructor(port, rootDir) {
        this.port = port;
        this.rootDir = rootDir;
        this.moduleDir = path.join(this.rootDir, 'modules');

        if (fs.existsSync(this.moduleDir)) {
            removeExistingDirectoryTree(this.moduleDir)
        }
        fs.mkdirSync(this.moduleDir);

        this.projects = {};
        this.deployments = {};

        this.server = new IPCServer(this.port);
        this.server.on('status', (req) => {
            const statusInfo = [];
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
            console.log("INCOMING DEPLOY...");
            const deployment = new Deployment(
                req.name,
                req.platform,
                req.deploymentDir,
                req.project
            );

            console.log("Copying files...")
            console.log(this.projects[req.project]);
            const deployDir = path.join(this.moduleDir, `${req.name}-${req.platform}`);
            copyEntireDirectory(req.deploymentDir, deployDir).then(() => {
                const env = new Environment();
                const portMap = this.projects[req.project].portMap;
                env.addSection('config', {
                    port: portMap[req.name]
                })

                const deps = this.projects[req.project].depedencies[req.name];
                console.log(req.name);
                console.log(this.projects[req.project].depedencies);
                console.log(this.projects[req.project].depedencies[req.name]);
                for (const d of deps) {
                    env.addSection(`${d}`, {
                        port: portMap[d]
                    });
                }

                env.build(path.join(deployDir, '.env'));

                deployment.deploymentDir = deployDir;
                this.deploy(deployment);
            });

            const deploymentStatus = {
                name: deployment.name,
                status: deployment.getStatus()
            };
            return deploymentStatus;
        }).on('project', async (req) => {
            console.log("INCOMING PROJECT...");

            let portMap = {};
            console.log("portmap")
            for (const moduleName in req.project) {
                console.log(`moduleName: ${moduleName}`);
                console.log(`req.project[moduleName]: ${req.project[moduleName]}`);
                if (!portMap.hasOwnProperty(moduleName)) {
                    console.log(`ADDING PORT FOR ${moduleName}`);
                    const newPort = getRandomPort();
                    portMap[moduleName] = await newPort;
                    console.log(`PORT: ${newPort}`);
                }
            }
            console.log(portMap);

            this.projects[req.name] = {
                depedencies: req.project,
                portMap: portMap
            }

            console.log("END OF PROJECT...");
            return {}
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

    async deploy(name, platform, deploymentDir, project) {
        let response = null;

        try {
            response = await this.client.request({
                action: "deploy",
                name: name,
                platform: platform,
                project: project,
                deploymentDir: deploymentDir
            });
        } catch (e) {
            throw new Error("Could not deploy. Server running?")
        }

        return response;
    }

    async project(name, data) {
        let response = null;

        try {
            response = await this.client.request({
                action: "project",
                name: name,
                project: data
            });
        } catch (e) {
            throw new Error("Could not deploy. Server running?")
        }

        return response;
    }
}