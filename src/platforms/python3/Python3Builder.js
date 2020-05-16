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

    async buildModule() {
        const python3Generator = new Python3Generator();
        python3Generator.setGeneratedDir(this.generatedDir);

        python3Generator.setup();

        // Generate gRPC package
        const protoFilePath = python3Generator.generateProto3(this.moduleName, this._interface);
        python3Generator.generateGRPC(this.moduleName, protoFilePath);
        const grpcPath = path.join(this.generatedDir, 'grpc');

        // Generate Server package
        const serverFilePath = python3Generator.generateServer(this.moduleName, this._interface);
        await this.__buildPackage(grpcPath, path.join(this.buildDir, 'interface'));
        await this.__buildPackage(this.sourceDir, path.join(this.buildDir, 'implementation'));
        fs.copyFileSync(serverFilePath, path.join(this.buildDir, path.basename(serverFilePath)));
        fs.mkdirSync(path.join(this.buildDir, 'implementation', 'ossimo'));
        fs.mkdirSync(path.join(this.buildDir, 'implementation', 'ossimo', 'components'));
        fs.writeFileSync(path.join(this.buildDir, 'implementation', 'ossimo', '__init__.py'), "");
        fs.writeFileSync(path.join(this.buildDir, 'implementation', 'ossimo', 'components', '__init__.py'), "");
    }

    async buildInterface() {
        const python3Generator = new Python3Generator();
        python3Generator.setGeneratedDir(this.generatedDir);

        python3Generator.setup();

        // Generate gRPC package
        const protoFilePath = python3Generator.generateProto3(this.moduleName, this._interface);
        python3Generator.generateGRPC(this.moduleName, protoFilePath);
        const grpcPath = path.join(this.generatedDir, 'grpc');
        
        // Generate Client package
        const clientBuildDir = path.join(this.buildDir, 'python3');
        fs.mkdirSync(clientBuildDir);
        const clientFilePath = python3Generator.generateClient(this.moduleName, this._interface);
        fs.copyFileSync(clientFilePath, path.join(clientBuildDir, path.basename(clientFilePath)));
        const clientPackageFilePath = python3Generator.generateClientPackageFile(this.moduleName);
        fs.copyFileSync(clientPackageFilePath, path.join(clientBuildDir, '__init__.py'));
        await this.__buildPackage(grpcPath, path.join(clientBuildDir, 'interface'));
    }

    /**
     * Creates a new Python3 package. It copies the source from one directory
     * into a new target package directory.
     * 
     * @param {string} sourcePath The path to the source file directory
     * @param {string} targetPath The path to final package directory
     */
    async __buildPackage(sourcePath, targetPath) {
        await copyEntireDirectory(sourcePath, targetPath);
        fs.writeFileSync(path.join(targetPath, '__init__.py'),"");
    }
}

export default Python3Builder;