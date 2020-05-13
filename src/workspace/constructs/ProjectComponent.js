import fs from 'fs';
import path from 'path';

import BaseConstruct from '../../core/constructs/BaseConstruct';
import Transport from '../../core/Transport';
import { OssimoOrchestratorClient } from '../../orchestrator';
import ConstructFactory from '../ConstructFactory';
import logger from '../../util/logger';

/**
 * Implements the BaseConstruct class to build and deploy Ossimo projects.
 */
class ProjectConstruct extends BaseConstruct {
    /**
     * Creates a ModuleComponent instance using the given OssimoFile, and
     * parses the defined implementation in the Ossimo configuration file.
     * 
     * @param {OssimoFile} ossimoFile 
     */
    constructor(ossimoFile) {
        super(ossimoFile);

        logger.info(`Parsing ${this.ossimoFile.name} project...`);

        this.components = [];
        const componentDir = path.join(this.constructDir, 'components');
        if (fs.existsSync(componentDir)) {
            const directories = fs.readdirSync(componentDir).filter(file => {
                const filePath = path.join(componentDir, file);
                const stat = fs.lstatSync(filePath);
                return stat.isDirectory();
            });

            logger.debug("Found the following components:")
            this.components = directories.map(dirname => {
                const dirPath = path.join(componentDir, dirname)
                return ConstructFactory(dirPath)
            });
        }
    }

    clean() {
        logger.info(`Cleaning ${this.ossimoFile.name} project...`);
        this.components.forEach(component => {
            component.clean();
        });
    }

    async build() {
        logger.info(`Building ${this.ossimoFile.name} project...`);
        for (const component of this.components) {
            await component.build();
        }
    }

    isBuilt() {
        return false
    }

    async deploy() {
        logger.info("Deploying project...");
        for (const component of this.components) {
            await component.deploy();
        }
    }
}

export default ProjectConstruct;