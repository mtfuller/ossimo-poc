/**
 * The abstract base class for a Deployer of some language platform.
 */
class BaseDeployer {
    constructor() {
        this.buildDir = null;
        this.orchestratorClient = null;
    }

    setBuildDir(buildDir) {
        this.buildDir = buildDir;
    }

    setOrchestratorClient(orchestratorClient) {
        this.orchestratorClient = orchestratorClient;
    }

    /**
     * Deploy platform build using the given Orchestrator client.
     */
    async deploy() {
        throw new Error("BaseModuleBuilder::deploy must be implemented");
    }
}

export default BaseDeployer;