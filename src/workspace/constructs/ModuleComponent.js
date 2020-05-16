import fs from 'fs';
import path from 'path';

import BaseComponent from '../../core/constructs/BaseComponent';
import { OssimoOrchestratorClient } from '../../orchestrator';
import logger from '../../util/logger';
import { platformFactory } from '../../platforms/PlatformFactory';

/**
 * Implements the BaseComponent class to build and deploy Ossimo modules.
 */
class ModuleComponent extends BaseComponent {
    /**
     * Creates a ModuleComponent instance using the given OssimoFile, and
     * parses the defined implementation in the Ossimo configuration file.
     * 
     * @param {OssimoFile} ossimoFile 
     */
    constructor(ossimoFile) {
        super(ossimoFile);

        logger.debug(`Parsing ${this.name} module...`);

        this.implementation = this.__parseImplementation(ossimoFile.implementation);

        /**
         * ModuleBuilder is responsible for generating source code, building
         * the module, and packaging everything so that it is ready to deploy.
         */
        this.moduleBuilder = new this.implementation.platform.Builder();
        this.moduleBuilder.setModuleName(this.name);
        this.moduleBuilder.setInterface(this.interface);
        this.moduleBuilder.setSourceDir(path.join(this.constructDir, 'src'));
        this.moduleBuilder.setBuildDir(path.join(this.constructDir, 'build'));
    }

    /**
     * Returns an object representing the implementation that is defined in
     * the Ossimo configuration file.
     * 
     * @param {Object} ossimoImplementation The raw object extracted from Ossimo
     * configuration file
     * 
     * @returns {Object} An object where the implementation configuration has
     * been parsed.
     */
    __parseImplementation(ossimoImplementation) {
        logger.debug(`Parsing ${this.name} implementation definition...`);
        
        if (ossimoImplementation === null) {
            throw new Error("Implementation is not defined");
        }

        const implementationObj = {};

        implementationObj.platform = platformFactory(ossimoImplementation.platform);
        implementationObj.sourceDir = path.dirname(ossimoImplementation.file);

        return implementationObj;
    }

    clean() {
        logger.info(`Cleaning ${this.name} module...`);
        this.moduleBuilder.clean();
    }

    async build() {
        logger.info(`Building ${this.name} module...`);
        this.moduleBuilder.setup();
        
        await this.moduleBuilder.buildModule();
    }

    /**
     * Generates/builds client interface code in the specified platform. 
     * 
     * @param {string} platformStr A string that represents the desired
     *  platform
     */
    async buildInterface(platformStr) {
        logger.debug(`Building ${this.name} module interface...`);
        const platform = platformFactory(platformStr);

        const builder = new platform.Builder();
        builder.setModuleName(this.name);
        builder.setInterface(this.interface);
        builder.setBuildDir(path.join(this.constructDir, 'build', 'clients'));

        builder.setup();
        await builder.buildInterface();
    }

    isBuilt() {
        return fs.existsSync(this.moduleBuilder.buildDir)
    }
}

export default ModuleComponent;