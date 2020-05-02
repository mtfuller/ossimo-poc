import BaseComponent from '../../core/BaseComponent';
import Python3 from '../../platforms/python3';
import Transport from '../../core/Transport';

const fs = require('fs');
const path = require('path');

class ModuleComponent extends BaseComponent {
    constructor(ossimoFile) {
        super(ossimoFile);

        this.implementation = this.__parseImplementation(ossimoFile.implementation);

        this.moduleBuilder = new this.implementation.platform.ModuleBuilder();
        this.moduleBuilder.setInterface(this.interface);
        this.moduleBuilder.setTransport(Transport.HTTP);
        this.moduleBuilder.setModuleDir(this.constructDir);

        this.deployer = new this.implementation.platform.Deployer();
        const buildDir = path.join(this.constructDir, 'build');
        this.deployer.setBuildDir(buildDir);
    }

    __parseImplementation(ossimoImplementation) {
        if (ossimoImplementation === null) {
            throw new Error("Implementation is not defined");
        }

        const implementationObj = {};

        switch (ossimoImplementation.platform) {
            case 'python3':
                implementationObj.platform = Python3; break;
            default:
                throw new Error("Platform does not exist: " + ossimoImplementation.platform);
        }

        implementationObj.sourceDir = path.dirname(ossimoImplementation.file);

        return implementationObj;
    }

    clean() {
        this.moduleBuilder.clean()
    }

    build() {
        this.moduleBuilder.build();
    }

    isBuilt() {
        return fs.existsSync(this.moduleBuilder.buildDir)
    }

    deploy() {
        this.deployer.deploy();
    }
}

export default ModuleComponent;