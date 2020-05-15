import fs from 'fs';
import path from 'path';

import { removeExistingDirectoryTree } from '../../util/fs-util';

/**
 * The abstract base class for a Builder of some language platform.
 */
class BaseBuilder {
    constructor() {
        this.moduleName = null;
        this._interface = null;
        this.buildDir = null;
        this.sourceDir = null;
        this.generatedDir = null;
    }

    setModuleName(moduleName) {
        this.moduleName = moduleName;
    }

    setInterface(_interface) {
        this._interface = _interface;
    }

    setBuildDir(buildDir) {
        this.buildDir = buildDir;
        this.generatedDir = path.join(this.buildDir, '.generated');
    }

    setSourceDir(sourceDir) {
        this.sourceDir = sourceDir;
    }

    /**
     * Removes all build related files and assets.
     */
    clean() {
        if (fs.existsSync(this.buildDir)) {
            console.log("REMOVING");
            removeExistingDirectoryTree(this.buildDir);
        }
    }

    /**
     * Clears the build directory of all contents.
     */
    setup() {
        console.log("SETUP");
        this.clean();

        fs.mkdirSync(this.buildDir);
    }

    /**
     * Generate and package all the necessary build files to allow the module
     * to be deployed.
     */
    async buildModule() {
        throw new Error("BaseBuilder::buildModule must be implemented");
    }

    /**
     * Generate and package all the necessary build files to allow the module
     * to be deployed.
     */
    async buildSdk() {
        throw new Error("BaseBuilder::buildSdk must be implemented");
    }
}

export default BaseBuilder;