import fs from 'fs';
import path from 'path';

import BaseComponent from '../../core/constructs/BaseComponent';
import Transport from '../../core/Transport';
import { OssimoOrchestratorClient } from '../../orchestrator';
import ConstructFactory from '../ConstructFactory';
import logger from '../../util/logger';
import ModuleComponent from './ModuleComponent';

/**
 * Implements the BaseComponent class to build and deploy Ossimo controllers.
 */
class ControllerComponent extends BaseComponent {
    constructor(ossimoFile) {
        super(ossimoFile);

        logger.info(`Parsing ${this.ossimoFile.name} controller...`);

        this.components = [];
        const componentDir = path.join(this.constructDir, 'components');
        if (fs.existsSync(componentDir)) {
            const directories = fs.readdirSync(componentDir).filter(file => {
                const filePath = path.join(componentDir, file);
                const stat = fs.lstatSync(filePath);
                return stat.isDirectory();
            });

            this.components = directories.map(dirname => {
                const dirPath = path.join(componentDir, dirname);
                return ConstructFactory(dirPath);
            });
        }

        this.delegation = this.__parseDelegation(this.ossimoFile.delegation);
    }


    __parseDelegation(ossimoDelegation) {
        if (ossimoDelegation === null) {
            throw new Error("Delegation is not defined");
        }

        let delegationObj = {};

        delegationObj = {
            "DoubleModule": {
                "doubleThisNumber": {
                    method: "double",
                    args: ["a"]
                }
            },
            "TriplerModule": {
                "tripleThisNumber": {
                    method: "triple",
                    args: ["b"]
                }
            }
        }

        return delegationObj;
    }

    clean() {
        logger.info(`Cleaning ${this.ossimoFile.name} controller...`);
        this.components.forEach(component => {
            component.clean();
        });
    }

    async build(type='standalone') {
        logger.info(`Building ${this.ossimoFile.name} controller...`);

        for (const component of this.components) {
            const componentName = component.ossimoFile.name;
            if (this.delegation.hasOwnProperty(componentName)) {
                const delegatedMethods = this.delegation[componentName];

                await component.build({
                    delegatedMethods: delegatedMethods
                });
            }
        }

        // switch(type) {
        //     case 'standalone':
        //         await this.moduleBuilder.buildStandalone(); break;
        //     case 'package':
        //         await this.moduleBuilder.buildPackage(); break;
        //     default:
        //         throw new Error('Build type is not valid');
        // }
    }

    isBuilt() {
        return false;//fs.existsSync(this.moduleBuilder.buildDir)
    }

    async deploy() {
        logger.info(`Deploying ${this.ossimoFile.name} controller...`);
        for (const component of this.components) {
            await component.deploy();
        }
    }
}

export default ControllerComponent;