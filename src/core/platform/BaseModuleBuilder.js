import fs from 'fs';
import path from 'path';

import { removeExistingDirectoryTree } from '../../util/fs-util';

/**
 * The abstract base class for a ModuleBuilder of some language platform.
 */
class BaseModuleBuilder {
    constructor() {
        this.moduleName = null;
        this._interface = null;
        this.transport = null;
        this.moduleDir = null;
        this.sourceDir = null;
        this.buildDir = null;
        this.generatedDir = null;
    }

    setModuleName(moduleName) {
        this.moduleName = moduleName;
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

    /**
     * Removes all build related files and assets.
     */
    clean() {
        if (fs.existsSync(this.buildDir)) {
            removeExistingDirectoryTree(this.buildDir);
        }
    }

    /**
     * Generate and package all the necessary build files to allow the module
     * to be deployed.
     */
    async build() {
        throw new Error("BaseModuleBuilder::build must be implemented");
    }
}

export default BaseModuleBuilder;