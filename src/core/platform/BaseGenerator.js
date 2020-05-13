import fs from 'fs';
import path from 'path';

const { exec } = require("child_process");

import { removeExistingDirectoryTree, createDirectoryIfNoneExist } from '../../util/fs-util';
import { execSync } from 'child_process';

/**
 * The abstract base class for a Generator of some language platform.
 */
class BaseGenerator {
    constructor(generatedDir) {
        this.generatedDir = generatedDir;
    }

    /**
     * Removes all generated files.
     */
    clean() {
        console.log("REMOVING GENERATED")
        if (fs.existsSync(this.generatedDir)) {
            removeExistingDirectoryTree(this.generatedDir);
        }
    }

    setup() {
        this.clean();

        fs.mkdirSync(this.generatedDir);
    }

    generateProto3(moduleName, _interface) {
        console.log("BaseGenerator::generateProto3");
        const packageName = moduleName.toLowerCase();

        let str = "";
        str += `syntax = "proto3";\n`;
        str += `package ${packageName};\n`;

        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

        let serviceDefinitionStr = "";
        let messageDefinitionStr = "";
        for (let methodName in _interface) {
            const serviceName = capitalize(methodName);
            const requestName = `${serviceName}Request`;
            const responseName = `${serviceName}Response`;

            // rpc Add (AddRequest) returns (AddReply) {}
            serviceDefinitionStr += `    rpc ${serviceName} (${requestName}) returns (${responseName}) {}\n`;


            messageDefinitionStr += `message ${requestName} {\n`
            for (const index in _interface[methodName].params) {
                const datatype = _interface[methodName].params[index].datatype;
                const paramName = _interface[methodName].params[index].name;

                // int32 b = 2;
                messageDefinitionStr += `    ${datatype} ${paramName} = ${parseInt(index) + 1};\n`
            }
            messageDefinitionStr += `}\n`
            messageDefinitionStr += `message ${responseName} {\n`
            messageDefinitionStr += `    ${_interface[methodName].returns} result = 1;\n`
            messageDefinitionStr += `}\n\n`
        }

        str += `\nservice ${moduleName} {\n`;
        str += serviceDefinitionStr;
        str += `}\n\n`;

        str += messageDefinitionStr;

        console.log(str);

        
        createDirectoryIfNoneExist(path.join(this.generatedDir, 'proto'))
        const protoFilePath = path.join(this.generatedDir, 'proto', `${packageName}.proto`);
        fs.writeFileSync(protoFilePath, str, {encoding: 'utf-8'});
        return protoFilePath;
    }

    generateGRPC(moduleName, sourceProtoFilepath) {
        console.log("BaseGenerator::generateGRPC");

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
    }
}

export default BaseGenerator;