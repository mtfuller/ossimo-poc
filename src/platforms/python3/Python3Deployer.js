import BaseDeployer from '../../core/platform/BaseDeployer';

/**
 * The Deployer for the Python3 platform.
 */
class Python3Deployer extends BaseDeployer {
    constructor() {
        super();
    }

    async deploy() {
        console.log(this.buildDir);

        console.log("Deploy:");
        console.log(await this.orchestratorClient.deploy(
            "test789",
            "python main.py 8082",
            this.buildDir
        ));
        console.log("====");
    }
}

export default Python3Deployer