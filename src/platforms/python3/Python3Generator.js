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
        this.clean();
        
        fs.mkdirSync(this.generatedDir);

        // Grab main.py template
        const mainTemplatePath = path.join(__dirname, 'templates', 'main.py');
        let mainTemplate = fs.readFileSync(mainTemplatePath).toString();

        // Generate necessary source code
        let str = "";
        const typeSet = new Set();
        for (let methodName in _interface) {
            const params = _interface[methodName].params;
            const returnType = _interface[methodName].returns;

            str += `    ${methodName}MethodBuilder = ControllerMethodBuilder(\'${methodName}\')\n`;
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
}

export default Python3Generator