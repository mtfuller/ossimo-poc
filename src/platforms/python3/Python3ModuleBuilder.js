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
        const python3Generator = new Python3Generator(this.generatedDir);

        python3Generator.setup();

        // Generate server & client
        const protoFilePath = python3Generator.generateProto3(this.moduleName, this._interface);
        python3Generator.generateGRPC(this.moduleName, protoFilePath);
        const serverFilePath = python3Generator.generateServer(this.moduleName, this._interface);
        const clientFilePath = python3Generator.generateClient(this.moduleName, this._interface);

        // Copy server & client files
        fs.copyFileSync(serverFilePath, path.join(this.buildDir, path.basename(serverFilePath)));
        fs.copyFileSync(clientFilePath, path.join(this.buildDir, path.basename(clientFilePath)));

        // Generate Ossimo SDK
        const grpcPath = path.join(this.generatedDir, 'grpc');
        const ossimoPath = path.join(this.buildDir, 'ossimo');
        await this.__buildPackage(grpcPath, ossimoPath);

        // Build Implementation Package
        const targetImplementationPath = path.join(this.buildDir, 'implementation');
        await this.__buildPackage(this.sourceDir, targetImplementationPath);

        python3Generator.clean();
    }

    async __buildPackage(sourceDir, targetPackageDir) {
        await copyEntireDirectory(sourceDir, targetPackageDir);
        fs.writeFileSync(path.join(targetPackageDir, '__init__.py'),"");
    }
}

export default Python3ModuleBuilder;