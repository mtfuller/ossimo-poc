import BaseDeployer from '../../core/platform/BaseDeployer';

import { exec } from 'child_process';

/**
 * The Deployer for the Python3 platform.
 */
class Python3Deployer extends BaseDeployer {
    constructor() {
        super();
        this.directory = null
    }

    setDir(dir) {
        this.directory = dir;
    }

    run(callback) {
        try {
            exec("python server.py", {cwd: this.directory}, callback).on('error', (err) => {
                console.error("ERROR!!");
                console.error(err);
            });
        } catch (error) {
            console.log(error);
        }
        
    }
}

export default Python3Deployer