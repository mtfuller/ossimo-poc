import path from 'path';
import OssimoFile from '../OssimoFile';

/**
 * The abstract base class that represents projects, modules, controllers, etc.
 */
class BaseConstruct {
    /**
     * Creates a BaseConstruct instance using an OssimoFile.
     * 
     * @param {OssimoFile} ossimoFile 
     */
    constructor(ossimoFile) {
        this.constructDir = path.dirname(ossimoFile.filePath);
        this.ossimoFile = ossimoFile;
    }

    /**
     * Clean all generated build files from the construct.
     */
    clean() {
        throw new Error("BaseContruct::clean not implemented");
    }

    /**
     * Generate, build, and package the construct, so it can be deployed.
     */
    async build() {
        throw new Error("BaseContruct::build not implemented");
    }

    /**
     * Returns true, if the construct is built. Otherwise, it returns false.
     */
    isBuilt() {
        throw new Error("BaseContruct::isBuilt not implemented");
    }

    /**
     * Deploys the built construct.
     */
    async deploy() {
        throw new Error("BaseContruct::deploy not implemented");
    }
}

export default BaseConstruct;