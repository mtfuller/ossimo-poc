import { platformFactory } from '../platforms/PlatformFactory';

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
        this.platform = platformFactory(platform);
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