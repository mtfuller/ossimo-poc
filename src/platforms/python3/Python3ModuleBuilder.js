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

    mapMethodName(methodName, methodAlias) {
        this._interface[methodName]['alias'] = methodAlias;
        console.log(this._interface);
    }

    async buildStandalone() {
        // Generate main.py
        console.log("GENERATOR")
        const python3Generator = new Python3Generator(this.generatedDir);
        python3Generator.setup();
        //const mainFilePath = python3Generator.generateMain(this.moduleName, this._interface);
        console.log("PROTO")
        const protoFilePath = python3Generator.generateProto3(this.moduleName, this._interface);
        console.log("GRPC")
        python3Generator.generateGRPC(this.moduleName, protoFilePath);
        const serverFilePath = python3Generator.generateServer(this.moduleName, this._interface);
        const clientFilePath = python3Generator.generateClient(this.moduleName, this._interface);
        const serverFileName = path.basename(serverFilePath);
        const clientFileName = path.basename(clientFilePath);
        fs.copyFileSync(serverFilePath, path.join(this.buildDir, serverFileName));
        fs.copyFileSync(clientFilePath, path.join(this.buildDir, clientFileName));

        // Generate Ossimo SDK
        const grpcPath = path.join(this.generatedDir, 'grpc');
        const ossimoPath = path.join(this.buildDir, 'ossimo');
        await this.buildPackage(grpcPath, ossimoPath);

        // Build Implementation Package
        const targetImplementationPath = path.join(this.buildDir, 'implementation');
        await this.buildPackage(this.sourceDir, targetImplementationPath);
    }

    async buildPackage(sourceDir, targetPackageDir) {
        await copyEntireDirectory(sourceDir, targetPackageDir);
        fs.writeFileSync(path.join(targetPackageDir, '__init__.py'),"");
    }
}

export default Python3ModuleBuilder;