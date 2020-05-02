const path = require('path');

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

export default BaseModuleBuilder;