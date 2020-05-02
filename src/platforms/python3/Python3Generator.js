const path = require('path');
const fs = require('fs');

class Python3Generator {
    constructor(generatedDir) {
        this.generatedDir = generatedDir
    }

    clean() {
        if (fs.existsSync(this.generatedDir)) {
            const deleteFolderRecursive = function(path) {
                var files = [];
                if( fs.existsSync(path) ) {
                    files = fs.readdirSync(path);
                    files.forEach(function(file,index){
                        var curPath = path + "/" + file;
                        if(fs.lstatSync(curPath).isDirectory()) { // recurse
                            deleteFolderRecursive(curPath);
                        } else { // delete file
                            fs.unlinkSync(curPath);
                        }
                    });
                    fs.rmdirSync(path);
                }
            };
            deleteFolderRecursive(this.generatedDir);
        }
    }

    generateMain(_interface) {
        this.clean();
        fs.mkdirSync(this.generatedDir);

        const mainTemplatePath = path.join(__dirname, 'templates', 'main.py');
        let mainTemplate = fs.readFileSync(mainTemplatePath).toString();

        console.log(_interface);

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
        const finalGeneratedOutput = mainTemplate.replace('{{METHOD_LIST}}', Object.keys(_interface).join(', '))
        
        const outputFile = path.join(this.generatedDir, 'main.py');
        fs.writeFileSync(outputFile, finalGeneratedOutput, { encoding: 'utf-8'});

        return outputFile;
    }
}

export default Python3Generator