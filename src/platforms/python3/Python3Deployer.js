import { exec } from 'child_process';

import BaseDeployer from '../../core/platform/BaseDeployer';

/**
 * The Deployer for the Python3 platform.
 */
class Python3Deployer extends BaseDeployer {
    constructor() {
        super();
    }

    run(callback) {
        try {
            exec("python server.py", {cwd: this.directory}, callback).on('error', (err) => {
                console.error("ERROR!!");
                console.error(err);
            });
        } catch (error) {
            console.error(error);
        }
        
    }
}

export default Python3Deployer