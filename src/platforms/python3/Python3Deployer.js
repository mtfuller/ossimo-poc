const path = require('path');
const fs = require('fs');

import { OssimoOrchestratorClient } from '../../orchestrator';

const { exec } = require('child_process');

class BaseModuleBuilder {
    constructor() {
        this._interface = null;
        this.transport = null;
        this.moduleDir = null;
        this.sourceDir = null;
        this.buildDir = null;
        this.generatedDir = null;
    }

    setInterface(_interface) {
        this._interface = _interface;
    }

    setTransport(transport) {
        this.transport = transport;
    }

    setModuleDir(moduleDir) {
        this.moduleDir = moduleDir;
        this.sourceDir = path.join(this.moduleDir, 'src');
        this.buildDir = path.join(this.moduleDir, 'build');
        this.generatedDir = path.join(this.moduleDir, '.generated');
    }

    build() {
        throw new Error("BaseModuleBuilder::build must be implemented");
    }
}

class Python3Deployer {
    constructor() {
        this.buildDir = null;
        this.ossimoOrchestrator = new OssimoOrchestratorClient(13131);
    }

    setBuildDir(buildDir) {
        this.buildDir = buildDir;
    }

    async deploy() {
        console.log(this.buildDir);

        console.log("Deploy:");
        console.log(await this.ossimoOrchestrator.deploy(
            "test789",
            "python main.py 8082",
            this.buildDir
        ));
        console.log("====");
    }
}

export default Python3Deployer