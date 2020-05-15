import fs from 'fs';
import path from 'path';

import BaseBuilder from '../../core/platform/BaseBuilder';
import Python3Generator from './Python3Generator';
import { copyEntireDirectory } from '../../util/fs-util';

/**
 * The Builder for the Python3 platform.
 */
class Python3Builder extends BaseBuilder {
    constructor() {
        super();
    }

    async __buildPackage(sourceDir, targetPackageDir) {
        console.log(`SRC: ${sourceDir} | TAR: ${targetPackageDir}`)
        await copyEntireDirectory(sourceDir, targetPackageDir);
        fs.writeFileSync(path.join(targetPackageDir, '__init__.py'),"");
    }

    /**
     * Generate and package all the necessary build files to allow the module
     * to be deployed.
     */
    async buildModule() {
        const python3Generator = new Python3Generator();
        python3Generator.setGeneratedDir(this.generatedDir);

        python3Generator.setup();

        // Generate gRPC package
        const protoFilePath = python3Generator.generateProto3(this.moduleName, this._interface);
        python3Generator.generateGRPC(this.moduleName, protoFilePath);
        const grpcPath = path.join(this.generatedDir, 'grpc');
        //const ossimoPath = path.join(this.buildDir, 'grpc');
        //await this.__buildPackage(grpcPath, ossimoPath);

        // Generate Server Package
        const serverFilePath = python3Generator.generateServer(this.moduleName, this._interface);
        await this.__buildPackage(grpcPath, path.join(this.buildDir, 'interface'));
        await this.__buildPackage(this.sourceDir, path.join(this.buildDir, 'implementation'));
        fs.copyFileSync(serverFilePath, path.join(this.buildDir, path.basename(serverFilePath)));
        fs.mkdirSync(path.join(this.buildDir, 'implementation', 'ossimo'));
        fs.mkdirSync(path.join(this.buildDir, 'implementation', 'ossimo', 'components'));
        fs.writeFileSync(path.join(this.buildDir, 'implementation', 'ossimo', '__init__.py'), "");
        fs.writeFileSync(path.join(this.buildDir, 'implementation', 'ossimo', 'components', '__init__.py'), "");

        python3Generator.clean();
    }

    async buildInterface() {
        const python3Generator = new Python3Generator();
        python3Generator.setGeneratedDir(this.generatedDir);

        python3Generator.setup();

        const protoFilePath = python3Generator.generateProto3(this.moduleName, this._interface);
        python3Generator.generateGRPC(this.moduleName, protoFilePath);
        const grpcPath = path.join(this.generatedDir, 'grpc');
        
        // Generate Client file
        const clientBuildDir = path.join(this.buildDir, 'python3');
        fs.mkdirSync(clientBuildDir);
        const clientFilePath = python3Generator.generateClient(this.moduleName, this._interface);
        fs.copyFileSync(clientFilePath, path.join(clientBuildDir, path.basename(clientFilePath)));
        const clientPackageFilePath = python3Generator.generateClientPackageFile(this.moduleName);
        fs.copyFileSync(clientPackageFilePath, path.join(clientBuildDir, '__init__.py'));
        await this.__buildPackage(grpcPath, path.join(clientBuildDir, 'interface'));

        python3Generator.clean();
    }
}

export default Python3Builder;