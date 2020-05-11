import fs from 'fs';

import { removeExistingDirectoryTree } from '../../util/fs-util';

/**
 * The abstract base class for a Generator of some language platform.
 */
class BaseGenerator {
    constructor(generatedDir) {
        this.generatedDir = generatedDir;
    }

    /**
     * Removes all generated files.
     */
    clean() {
        if (fs.existsSync(this.generatedDir)) {
            removeExistingDirectoryTree(this.generatedDir);
        }
    }
}

export default BaseGenerator;