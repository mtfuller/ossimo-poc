import path from 'path';
import OssimoFile from './OssimoFile';

class BaseConstruct {
    constructor(ossimoFile) {
        this.constructDir = path.dirname(ossimoFile.filePath);
        this.ossimoFile = ossimoFile;
    }

    clean() {
        throw new Error("BaseContruct::clean not implemented");
    }

    build() {
        throw new Error("BaseContruct::build not implemented");
    }

    isBuilt() {
        throw new Error("BaseContruct::isBuilt not implemented");
    }

    deploy() {
        throw new Error("BaseContruct::deploy not implemented");
    }
}

export default BaseConstruct;