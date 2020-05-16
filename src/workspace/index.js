import ConstructFactory from './ConstructFactory';
import ProjectConstruct from './constructs/ProjectConstruct';

/**
 * The workspace class is used explore a given Ossimo directory, provide
 * information about the project or component, and perform build and deployment
 * related tasks.
 */
class Workspace {
    constructor(dirPath) {
        this.workingDir = dirPath;

        this.construct = ConstructFactory(this.workingDir);
    }

    /**
     * Cleans the entire workspace of generated build and deployment files from
     * the Ossimo project or component.
     */
    clean() {
        this.construct.clean();
    }

    /**
     * Builds the Ossimo project or component that the workspace is looking at.
     */
    async build() {
        await this.construct.build();
    }

    /**
     * Deploys the Ossimo project or component.
     */
    async deploy() {
        if (!this.construct instanceof ProjectConstruct) {
            throw new Error("Only Ossimo projects can be deployed");
        }

        if (!this.construct.isBuilt()) {
            throw new Error("Workspace is not built. Build and then run deploy");
        }
        
        this.construct.deploy();
    }
}

export default Workspace;