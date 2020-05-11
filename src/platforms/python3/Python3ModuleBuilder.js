import fs from 'fs';
import path from 'path';

import BaseModuleBuilder from '../../core/platform/BaseModuleBuilder';
import Python3Generator from './Python3Generator';
import { copyEntireDirectory } from '../../util/fs-util';

/**
 * The ModuleBuilder for the Python3 platform.
 */
class Python3ModuleBuilder extends BaseModuleBuilder {
    constructor() {
        super();
    }

    async build() {
        this.clean();

        fs.mkdirSync(this.buildDir);

        // Generate main.py
        const python3Generator = new Python3Generator(this.generatedDir);
        const mainFilePath = python3Generator.generateMain(this.moduleName, this._interface);
        const mainFileName = path.basename(mainFilePath);
        fs.copyFileSync(mainFilePath, path.join(this.buildDir, mainFileName));

        // Copy Ossimo SDK
        const sdkPath = path.join(__dirname, 'sdk');
        const ossimoPath = path.join(this.buildDir, 'ossimo');
        await copyEntireDirectory(sdkPath, ossimoPath);

        // Inject developer implementation code into Python3 package
        const implementationBuildPath = path.join(this.buildDir, 'implementation');
        await copyEntireDirectory(this.sourceDir, implementationBuildPath);
        const initFilePath = path.join(implementationBuildPath, '__init__.py');
        fs.writeFileSync(initFilePath, "");

        python3Generator.clean();
    }
}

export default Python3ModuleBuilder;