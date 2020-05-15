import fs from 'fs';
import path from 'path';

import BaseComponent from '../../core/constructs/BaseComponent';
import Transport from '../../core/Transport';
import { OssimoOrchestratorClient } from '../../orchestrator';
import logger from '../../util/logger';
import { platformFactory } from '../PlatformFactory';

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

        logger.info(`Parsing ${this.ossimoFile.name} module...`);

        this.implementation = this.__parseImplementation(ossimoFile.implementation);

        /**
         * ModuleBuilder is responsible for generating source code, building
         * the module, and packaging everything so that it is ready to deploy.
         */
        this.moduleBuilder = new this.implementation.platform.Builder();
        this.moduleBuilder.setModuleName(this.ossimoFile.name);
        this.moduleBuilder.setInterface(this.interface);
        this.moduleBuilder.setSourceDir(path.join(this.constructDir, 'src'));
        this.moduleBuilder.setBuildDir(path.join(this.constructDir, 'build'));

        /**
         * Deployer is reponsible for deploying the built component to the
         * appropriate target.
         */
        this.deployer = new this.implementation.platform.Deployer();
        this.deployer.setBuildDir(this.moduleBuilder.buildDir);
        this.deployer.setOrchestratorClient(new OssimoOrchestratorClient(13131))
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
        if (ossimoImplementation === null) {
            throw new Error("Implementation is not defined");
        }

        const implementationObj = {};

        try {
            logger.debug(ossimoImplementation.platform);
            implementationObj.platform = require(`../../platforms/${ossimoImplementation.platform}`);
        } catch (e) {
            logger.error(e);
            throw new Error("Platform does not exist: " + ossimoImplementation.platform);
        }

        implementationObj.sourceDir = path.dirname(ossimoImplementation.file);

        return implementationObj;
    }

    clean() {
        logger.info(`Cleaning ${this.ossimoFile.name} module...`);
        this.moduleBuilder.clean();
    }

    async build() {
        this.moduleBuilder.setup();

        logger.info(`Building ${this.ossimoFile.name} module...`);
        await this.moduleBuilder.buildModule();
    }

    async buildInterface(platformStr) {
        const platform = platformFactory(platformStr);

        const builder = new platform.Builder();
        builder.setModuleName(this.ossimoFile.name);
        builder.setInterface(this.interface);
        builder.setBuildDir(path.join(this.constructDir, 'build', 'clients'));

        builder.setup();

        await builder.buildInterface();
    }

    isBuilt() {
        return fs.existsSync(this.moduleBuilder.buildDir)
    }

    async deploy() {
        logger.info(`Deploying ${this.ossimoFile.name} module...`);
        //this.deployer.deploy();
    }
}

export default ModuleComponent;