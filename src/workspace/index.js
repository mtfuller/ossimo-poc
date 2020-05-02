import ConstructFactory from './ConstructFactory';

import { OssimoOrchestratorClient, Deployment } from '../orchestrator';

const net = require('net');
const path = require('path');

class Workspace {
    constructor(dirPath) {
        this.workingDir = dirPath;

        this.construct = ConstructFactory(this.workingDir);

        this.project = null;

        console.log(this);
    }

    clean() {
        this.construct.clean();
    }

    build() {
        this.construct.build();
    }

    async deploy() {
        if (!this.construct.isBuilt()) {
            throw new Error("Workspace is not built. Build and then run deploy")
        }
        
        this.construct.deploy();
    }
}

export default Workspace;