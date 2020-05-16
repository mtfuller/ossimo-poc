import fs from 'fs';
import path from 'path';

import BaseConstruct from '../../core/constructs/BaseConstruct';
import { OssimoOrchestratorClient } from '../../orchestrator';
import ConstructFactory from '../ConstructFactory';
import logger from '../../util/logger';
import ModuleComponent from './ModuleComponent';
import { copyEntireDirectory, removeExistingDirectoryTree } from '../../util/fs-util';

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

        logger.debug(`Parsing ${this.name} project...`);

        this.components = [];
        const componentDir = path.join(this.constructDir, 'components');
        if (fs.existsSync(componentDir)) {
            const directories = fs.readdirSync(componentDir).filter(file => {
                const filePath = path.join(componentDir, file);
                const stat = fs.lstatSync(filePath);
                return stat.isDirectory();
            });

            this.components = directories.map(dirname => {
                const dirPath = path.join(componentDir, dirname)
                return ConstructFactory(dirPath)
            });
            const componentsMessage = this.components.map(c => `    - ${c.name} (${c.constructor.name})`)
                .join('\n');
            logger.debug(`Found the following components:\n${componentsMessage}`);
        }

        this.modules = {};

        this.deployer = new OssimoOrchestratorClient(13131);
    }

    clean() {
        logger.info(`Cleaning ${this.name} project...`);
        this.components.forEach(component => {
            component.clean();
        });
    }

    async build() {
        logger.info(`Building ${this.name} project...`);

        const buildDir = path.join(this.constructDir, 'build');
        if(fs.existsSync(buildDir)) removeExistingDirectoryTree(buildDir);
        fs.mkdirSync(buildDir);

        logger.debug("Building all components...");
        const buildingComponents = this.components.map(c => c.build());
        await Promise.all(buildingComponents).catch(err => {
            logger.error("Error when building modules:")
            logger.error(err);
        });

        logger.debug("Moving module build artifacts to project build folder...")
        const moduleComponents = this.components.filter(c => c instanceof ModuleComponent);
        const copyingModuleBuilds = moduleComponents.map(m => {
            const targetDirectory = path.join(buildDir, m.name);
            fs.mkdirSync(targetDirectory);
            return copyEntireDirectory(m.moduleBuilder.buildDir, targetDirectory); 
        });
        await Promise.all(copyingModuleBuilds).catch(err => {
            logger.error("Error when copying module builds:")
            logger.error(err);
        });

        const moduleMap = {};
        moduleComponents.forEach(m => moduleMap[m.name] = m);

        const dependentModules = moduleComponents.filter(m => m.dependencies !== null);
        for (const module of dependentModules) {
            const moduleName = module.name;
            const dependencies = module.dependencies.map(d => moduleMap[d]);
            const platform = module.implementation.platform.name;

            logger.debug(`Building all necessary dependencies for ${moduleName}...`)
            const dependencyInterfaces = dependencies.map(dep => dep.buildInterface(platform));
            await Promise.all(dependencyInterfaces).catch(err => {
                logger.error("Error when building dependency interfaces:")
                logger.error(err);
            });

            logger.debug(`Injecting all dependency interfaces for ${moduleName}...`)
            const injectingInterfaces = dependencies.map(dep => {
                logger.debug(`Injecting interface for ${dep.name} into ${moduleName}...`);
                const sourceDir = path.join(dep.constructDir, 'build', 'clients', platform);
                const targetDir = path.join(buildDir, moduleName, 'implementation', 'ossimo', 'components', dep.name);
                return copyEntireDirectory(sourceDir, targetDir);
            });
            await Promise.all(injectingInterfaces).catch(err => {
                logger.error("Error when copying interfaces:")
                logger.error(err);
            });
        }
    }

    isBuilt() {
        return true
    }

    /**
     * Deploy all of the projects modules to the Ossimo Orchestrator server.
     */
    async deploy() {
        logger.info(`Deploying ${this.name} project...`);

        const moduleComponents = this.components.filter(c => c instanceof ModuleComponent);
        
        const projectData = {};
        moduleComponents.forEach(m => projectData[m.name] = m.dependencies);

        logger.debug("Configuring project in Ossimo orchestrator...");
        await this.deployer.project(this.name, projectData)

        logger.debug("Deploying each component...");
        const deployedComponents = this.components.map(component => {
            logger.info(`Deploying ${component.name}...`)

            return this.deployer.deploy(
                component.name,
                component.implementation.platform.name,
                path.join(this.constructDir, 'build', component.name),
                this.name
            ).then(data => {
                logger.info(`Deployed ${component.name}.`)
            });
        })
        await Promise.all(deployedComponents);

        logger.info("Finished deployment.")
    }
}

export default ProjectConstruct;