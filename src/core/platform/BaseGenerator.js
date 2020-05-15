import fs from 'fs';
import path from 'path';

import { removeExistingDirectoryTree, createDirectoryIfNoneExist } from '../../util/fs-util';
import { capitalize } from '../../util/string-util';


/**
 * The abstract base class for a Generator of some language platform.
 */
class BaseGenerator {
    constructor() {
        this.generatedDir = null;
    }

    setGeneratedDir(generatedDir) {
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

    /**
     * Clears the generatedDir of all content.
     */
    setup() {
        this.clean();

        fs.mkdirSync(this.generatedDir);
    }

    /**
     * Generates a new Protobuf 3 file for a given moduleName and interface spec.
     * 
     * @param {string} moduleName The name of the module
     * @param {Object} _interface The interface of the module
     */
    generateProto3(moduleName, _interface) {
        const packageName = moduleName.toLowerCase();

        let str = "";
        str += `syntax = "proto3";\n`;
        str += `package ${packageName};\n`;

        let serviceDefinitionStr = "";
        let messageDefinitionStr = "";
        for (let methodName in _interface) {
            const serviceName = capitalize(methodName);
            const requestName = `${serviceName}Request`;
            const responseName = `${serviceName}Response`;

            // Ex. rpc Add (AddRequest) returns (AddReply) {}
            serviceDefinitionStr += `    rpc ${serviceName} (${requestName}) returns (${responseName}) {}\n`;

            messageDefinitionStr += `message ${requestName} {\n`
            for (const index in _interface[methodName].params) {
                const datatype = _interface[methodName].params[index].datatype;
                const paramName = _interface[methodName].params[index].name;

                // Ex. int32 b = 2;
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
        
        createDirectoryIfNoneExist(path.join(this.generatedDir, 'proto'))
        const protoFilePath = path.join(this.generatedDir, 'proto', `${packageName}.proto`);
        fs.writeFileSync(protoFilePath, str, {encoding: 'utf-8'});
        return protoFilePath;
    }

    /**
     * Generate the gRPC module for the desired platform.
     * 
     * @param {string} moduleName The name of the module
     * @param {string} sourceProtoFilepath The filepath of the Protobuf .proto
     *  file
     */
    generateGRPC(moduleName, sourceProtoFilepath) {
        throw new Error("BaseGenerator::generateGRPC must be implemented")
    }

    /**
     * Generates a new file where all of the template variables of the given
     * template file have been replaced by the corresponding values defined
     * in data.
     * 
     * @param {string} templateFilePath The filepath to the template file
     * @param {Object} data An object that has each template variable mapped to
     *  a value.
     */
    generatePlatformFileFromTemplate(templateFilePath, data={}) {
        const outputFilename = path.basename(templateFilePath);
        let templateContents = fs.readFileSync(templateFilePath).toString();

        // Inject data values into the template
        const insertTextPattern = /\{\{(\w*)\}\}/g;
        templateContents = templateContents.replace(insertTextPattern, (match, p) => data[p]);

        // Create a new file in the generated directory
        const outputFile = path.join(this.generatedDir, outputFilename);
        fs.writeFileSync(outputFile, templateContents, { encoding: 'utf-8'});

        return outputFile;
    }
}

export default BaseGenerator;