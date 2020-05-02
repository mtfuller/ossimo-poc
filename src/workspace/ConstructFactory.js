import OssimoFile from '../core/OssimoFile';
import ModuleComponent from './components/ModuleComponent';
import ControllerComponent from './components/ControllerComponent';
import BaseConstruct from '../core/BaseConstruct';

const path = require('path');

function constructFactory(constructDir) {
    const ossimoFilePath = path.join(constructDir, 'ossimo.yml');
    const ossimoFile = new OssimoFile(ossimoFilePath);

    let construct = null;
    switch (ossimoFile.type) {
        case 'module': 
            construct = new ModuleComponent(ossimoFile); break;
        case 'controller': 
            construct = new ControllerComponent(ossimoFile); break;
        default:
            construct = new BaseConstruct(ossimoFile);
    }

    return construct;
}

export default constructFactory;