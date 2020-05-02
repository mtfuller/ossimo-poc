import BaseModuleBuilder from '../../core/BaseModuleBuilder';
import Python3Generator from './Python3Generator';
const path = require('path');
const fs = require('fs');
const ncp = require('ncp');

class Python3ModuleBuilder extends BaseModuleBuilder {
    constructor() {
        super();
    }

    clean() {
        if (fs.existsSync(this.buildDir)) {
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
            deleteFolderRecursive(this.buildDir);
        }
    }

    build() {
        this.clean();

        fs.mkdirSync(this.buildDir);

        // Generate main.py
        const test = new Python3Generator(this.generatedDir);
        const mainFilePath = test.generateMain(this._interface);
        const mainFileName = path.basename(mainFilePath);
        fs.copyFileSync(mainFilePath, path.join(this.buildDir, mainFileName));

        // Copy Ossimo SDK
        const sdkPath = path.join(__dirname, 'sdk');
        const ossimoPath = path.join(this.buildDir, 'ossimo');
        ncp.limit = 16;
        ncp(sdkPath, ossimoPath, (err) => {
            if (err) {
                return console.error(err);
            }

            // Copy Implementation
            const implementationBuildPath = path.join(this.buildDir, 'implementation');
            ncp(this.sourceDir, implementationBuildPath, function (err) {
                if (err) {
                    return console.error(err);
                }

                const initFilePath = path.join(implementationBuildPath, '__init__.py');
                fs.writeFileSync(initFilePath, "");
                test.clean();
                console.log('done!');
            });
        });


    }
}

export default Python3ModuleBuilder;