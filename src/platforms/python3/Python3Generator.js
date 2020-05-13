import fs from 'fs';
import path from 'path';

import BaseGenerator from '../../core/platform/BaseGenerator';

/**
 * The Generator for the Python3 platform.
 */
class Python3Generator extends BaseGenerator {
    constructor(generatedDir) {
        super(generatedDir);
    }

    /**
     * Generate the main.py, the entry point of the Ossimo module to be run.
     * 
     * @param {Object} _interface Object that describes the interface of the
     * component
     * 
     * @returns {string} Output path of the newly generated main.py file
     */
    generateMain(module_name, _interface) {

        // Grab main.py template
        const mainTemplatePath = path.join(__dirname, 'templates', 'main.py');
        let mainTemplate = fs.readFileSync(mainTemplatePath).toString();

        // Generate necessary source code
        let str = "";
        const typeSet = new Set();
        for (let methodName in _interface) {
            const params = _interface[methodName].params;
            const returnType = _interface[methodName].returns;
            const methodNameStr = (_interface[methodName].hasOwnProperty('alias')) 
                ? _interface[methodName].alias 
                : methodName;

            str += `    ${methodName}MethodBuilder = ControllerMethodBuilder(\'${methodNameStr}\')\n`;
            for (let param of params) {
                typeSet.add(param.datatype);
                str += `    ${methodName}MethodBuilder.addParameter(\'${param.name}\', ${param.datatype})\n`;
            }
            str += `    ${methodName}MethodBuilder.setReturnType(${returnType})\n`;
            str += `    ${methodName}MethodBuilder.setCallableFunction(${methodName})\n`;
            str += `    ${methodName}Method = ${methodName}MethodBuilder.build()\n`;
            str += `    controller.registerMethod(${methodName}Method)\n`;
            str += `\n`;
        }
        mainTemplate = mainTemplate.replace('{{INSERT}}', str)
        mainTemplate = mainTemplate.replace('{{MODULE_NAME}}', module_name)
        const finalGeneratedOutput = mainTemplate.replace('{{METHOD_LIST}}', Object.keys(_interface).join(', '))
        
        // Write main.py to the generated directory
        const outputFile = path.join(this.generatedDir, 'main.py');
        fs.writeFileSync(outputFile, finalGeneratedOutput, { encoding: 'utf-8'});

        return outputFile;
    }

    generateServer(moduleName, _interface) {
        const packageName = moduleName.toLowerCase();

        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        // Grab server.py template
        const serverTemplatePath = path.join(__dirname, 'templates', 'server.py');
        let serverTemplate = fs.readFileSync(serverTemplatePath).toString();

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
            moduleServerMethods += `        except:\n`;
            moduleServerMethods += `            logging.error("AHHH!!! ERROR!!")\n`;
            moduleServerMethods += `        return ${packageName}_pb2.${capitalize(methodName)}Response(result=result)\n\n`;
        }

        const data = {
            MODULE_PACKAGE_NAME: packageName,
            MODULE_NAME: moduleName,
            MODULE_SERVER_METHODS: moduleServerMethods
        }

        const insertTextPattern = /\{\{(\w*)\}\}/g;
        serverTemplate = serverTemplate.replace(insertTextPattern, (match, p) => {
            return data[p];
        });

        // Write main.py to the generated directory
        const outputFile = path.join(this.generatedDir, 'server.py');
        fs.writeFileSync(outputFile, serverTemplate, { encoding: 'utf-8'});

        return outputFile;
    }

    generateClient(moduleName, _interface) {
        const packageName = moduleName.toLowerCase();

        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        // Grab server.py template
        const serverTemplatePath = path.join(__dirname, 'templates', 'client.py');
        let serverTemplate = fs.readFileSync(serverTemplatePath).toString();

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
            moduleClientMethods += `        return myResult\n\n`
        }

        const data = {
            MODULE_PACKAGE_NAME: packageName,
            MODULE_NAME: moduleName,
            MODULE_CLIENT_METHODS: moduleClientMethods
        }

        const insertTextPattern = /\{\{(\w*)\}\}/g;
        serverTemplate = serverTemplate.replace(insertTextPattern, (match, p) => {
            return data[p];
        });

        // Write main.py to the generated directory
        const outputFile = path.join(this.generatedDir, 'client.py');
        fs.writeFileSync(outputFile, serverTemplate, { encoding: 'utf-8'});

        return outputFile;
    }
}

export default Python3Generator;