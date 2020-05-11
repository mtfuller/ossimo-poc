import path from 'path';

import BaseConstruct from '../core/constructs/BaseConstruct';
import OssimoFile from '../core/OssimoFile';
import ModuleComponent from './components/ModuleComponent';
import ControllerComponent from './components/ControllerComponent';

const DEFAULT_OSSIMO_FILENAME = "ossimo.yml";

/**
 * Creates and returns an instance based on the type defined in the ossimo.yml
 * file.
 * 
 * @param {string} constructDir The root directory of the Ossimo construct,
 * containing an ossimo.yml file.
 *  
 * @returns {BaseConstruct} An instance of the appropriate construct type,
 * defined in the ossimo.yml file.
 */
function constructFactory(constructDir) {
    const ossimoFilePath = path.join(constructDir, DEFAULT_OSSIMO_FILENAME);
    const ossimoFile = new OssimoFile(ossimoFilePath);

    switch (ossimoFile.type) {
        case 'module': 
            return new ModuleComponent(ossimoFile);
        case 'controller': 
            return new ControllerComponent(ossimoFile);
        default:
            return new BaseConstruct(ossimoFile);
    }
}

export default constructFactory;