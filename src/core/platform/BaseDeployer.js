/**
 * The abstract base class for a Deployer of some language platform.
 */
class BaseDeployer {
    constructor() {
        this.directory = null;
    }

    setDir(dir) {
        this.directory = dir;
    }

    /**
     * Starts the module as a new local process.
     * 
     * @param {function} callback The process callback
     */
    run(callback) {
        throw new Error("BaseDeployer::run must be implemented");
    }
}

export default BaseDeployer;