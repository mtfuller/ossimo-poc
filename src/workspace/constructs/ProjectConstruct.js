import fs from 'fs';
import path from 'path';

import BaseConstruct from '../../core/constructs/BaseConstruct';
import Transport from '../../core/Transport';
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

        this.modules = {};

        this.deployer = new OssimoOrchestratorClient(13131);
    }

    clean() {
        logger.info(`Cleaning ${this.ossimoFile.name} project...`);
        this.components.forEach(component => {
            component.clean();
        });
    }

    async build() {
        logger.info(`Building ${this.ossimoFile.name} project...`);
        const buildDir = path.join(this.constructDir, 'build');
        if(fs.existsSync(buildDir)) removeExistingDirectoryTree(buildDir);
        fs.mkdirSync(buildDir);

        for (const component of this.components) {
            await component.build();

            if (component instanceof ModuleComponent) {
                console.log("MODULE!!");
                const targetDirectory = path.join(buildDir, component.ossimoFile.name);
                fs.mkdirSync(targetDirectory);
                await copyEntireDirectory(component.moduleBuilder.buildDir, targetDirectory);
            }
        }

        const componentMap = {};
        this.components.forEach(c => componentMap[c.ossimoFile.name] = c);

        for (const componentName in componentMap) {
            const component = componentMap[componentName];

            if (component instanceof ModuleComponent) {
                console.log(`NAME: ${component.ossimoFile.name}`);
                console.log(`DEPS: ${component.dependencies}`);
                console.log(`PLAT: ${component.implementation.platform.name}`);

                console.log(component.dependencies);
                if (component.dependencies === null)
                    continue;

                for (const dep of component.dependencies) {
                    console.log(`DEP: ${dep}`);
                    const dependency = componentMap[dep];
                    console.log(`DEP_PLATFORM: ${component.implementation.platform.name}`)
                    await dependency.buildInterface(component.implementation.platform.name);
                    
                    const sourceDir = path.join(dependency.constructDir, 'build', 'clients', component.implementation.platform.name);
                    const targetDir = path.join(buildDir, component.ossimoFile.name, 'implementation', 'ossimo', 'components', dep);
                    try {
                        console.log("HELLO!");
                    await copyEntireDirectory(sourceDir, targetDir);
                    } catch (error) {
                        console.error(error);
                    }
                    

                }
                // const builder = new component.implementation.platform.Builder();
                // builder.setModuleName(this.ossimoFile.name);
                // builder.setInterface(component.interface);
                // builder.setBuildDir(path.join(this.constructDir, 'build', 'sdk'));
                // builder.setup();
                // builder.buildSdk();
            }
        }
    }

    isBuilt() {
        return true
    }

    async deploy() {
        logger.info("Deploying project...");
        const componentMap = {};
        this.components.forEach(c => componentMap[c.ossimoFile.name] = c);

        const projectData = {};
        for (const componentName in componentMap) {
            const component = componentMap[componentName];
            console.log(componentName);
            projectData[componentName] = [];
            if (component.dependencies === null) continue;
            for (const dep of component.dependencies) {
                console.log(dep);
                projectData[componentName].push(dep);
            }
        }
        console.log(projectData);

        await this.deployer.project(this.ossimoFile.name, projectData)

        let counter = 0;
        for (const component of this.components) {
            logger.info(`Deploying ${component.ossimoFile.name}...`)

            await this.deployer.deploy(
                component.ossimoFile.name,
                component.implementation.platform.name,
                path.join(this.constructDir, 'build', component.ossimoFile.name),
                this.ossimoFile.name
            )
        }
    }
}

export default ProjectConstruct;