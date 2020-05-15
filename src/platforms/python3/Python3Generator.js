import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import BaseGenerator from '../../core/platform/BaseGenerator';
import { createDirectoryIfNoneExist } from '../../util/fs-util';
import { capitalize } from '../../util/string-util';

/**
 * The Generator for the Python3 platform.
 */
class Python3Generator extends BaseGenerator {
    constructor(generatedDir) {
        super(generatedDir);
    }

    generateGRPC(moduleName, sourceProtoFilepath) {
        const packageName = moduleName.toLowerCase();
        const targetDirectory = this.generatedDir;

        createDirectoryIfNoneExist(path.join(this.generatedDir, 'grpc'))

        console.log(targetDirectory);

        execSync(`python -m grpc_tools.protoc -I ./proto/ --python_out=./grpc --grpc_python_out=./grpc ./proto/${packageName}.proto`, {
            cwd: targetDirectory
        });

        const grpcFilePath = path.join(targetDirectory, 'grpc', `${packageName}_pb2_grpc.py`);
        let fileContent = fs.readFileSync(grpcFilePath, { encoding: 'utf-8'});

        const oldImportStatement = `import ${packageName}_pb2 as ${packageName}__pb2`;
        const newImportStatement = `from . ${oldImportStatement}`;
        fileContent = fileContent.replace(oldImportStatement, newImportStatement);
        
        fs.writeFileSync(grpcFilePath, fileContent, {encoding: 'utf-8'});

        return grpcFilePath;
    }

    /**
     * Generate the server python file
     * 
     * @param {string} moduleName The name of the module to generate the server
     *  code for
     * @param {Object} _interface The interface of the module
     */
    generateServer(moduleName, _interface) {
        const packageName = moduleName.toLowerCase();

        let moduleServerMethods = "";
        for (const methodName in _interface) {
            moduleServerMethods += `    def ${capitalize(methodName)}(self, request, context):\n`;

            const params = _interface[methodName].params.map(x => x.name);
            params.forEach(param => {
                moduleServerMethods += `        ${param} = request.${param}\n`;
            });
            moduleServerMethods += `        try:\n`;

            const paramNames = params.join(', ');
            moduleServerMethods += `            result = ${moduleName}.${methodName}(${paramNames})\n`;
            moduleServerMethods += `        except Exception as e:\n`;
            moduleServerMethods += `            logging.error(e)\n`;
            moduleServerMethods += `        return ${packageName}_pb2.${capitalize(methodName)}Response(result=result)\n\n`;
        }

        const serverTemplatePath = path.join(__dirname, 'templates', 'server.py');
        const outputFile = this.generatePlatformFileFromTemplate(serverTemplatePath, {
            MODULE_PACKAGE_NAME: packageName,
            MODULE_NAME: moduleName,
            MODULE_SERVER_METHODS: moduleServerMethods
        })

        return outputFile;
    }

    /**
     * Generate the client python file
     * 
     * @param {string} moduleName The name of the module to generate the client
     *  code for
     * @param {Object} _interface The interface of the module
     */
    generateClient(moduleName, _interface) {
        const packageName = moduleName.toLowerCase();

        let moduleClientMethods = "";
        for (const methodName in _interface) {
            const params = _interface[methodName].params.map(x => x.name);

            const paramNames = params.join(', ');
            moduleClientMethods += `    def ${methodName}(self, ${paramNames}):\n`

            const paramDefaultValues = params.map(x => `${x}=${x}`).join(', ')
            moduleClientMethods += `        request = ${packageName}_pb2.${capitalize(methodName)}Request(${paramDefaultValues})\n`

            moduleClientMethods += `        with grpc.insecure_channel(self.server_address) as channel:\n`
            moduleClientMethods += `            stub = ${packageName}_pb2_grpc.${moduleName}Stub(channel)\n`
            moduleClientMethods += `            myResult = stub.${capitalize(methodName)}(request)\n`
            moduleClientMethods += `        return myResult.result\n\n`
        }

        const serverTemplatePath = path.join(__dirname, 'templates', 'client.py');
        const outputFile = this.generatePlatformFileFromTemplate(serverTemplatePath, {
            MODULE_PACKAGE_NAME: packageName,
            MODULE_NAME: moduleName,
            MODULE_CLIENT_METHODS: moduleClientMethods
        })

        return outputFile;
    }

        /**
     * Generate the client python file
     * 
     * @param {string} moduleName The name of the module to generate the client
     *  code for
     * @param {Object} _interface The interface of the module
     */
    generateClientPackageFile(moduleName) {
        const serverTemplatePath = path.join(__dirname, 'templates', 'client_package_init.py');
        const outputFile = this.generatePlatformFileFromTemplate(serverTemplatePath, {
            MODULE_NAME: moduleName
        })

        return outputFile;
    }
}

export default Python3Generator;