const fs = require('fs');
import yaml from 'js-yaml';

class OssimoFile {
    constructor(filePath) {
        if (!fs.existsSync(filePath)) {
            throw Error(`The Ossimo File does not exist: ${filePath}`);
        }
        this.filePath = filePath;

        const file = fs.readFileSync(filePath, 'utf8');
        let fileContents = yaml.safeLoad(file);
        
        this.name = Object.keys(fileContents)[0];
        fileContents = fileContents[this.name];

        this.type = this.__getValueOrNull(fileContents, 'type');
        this.interface = this.__getValueOrNull(fileContents, 'interface');
        this.implementation = this.__getValueOrNull(fileContents, 'implementation');
    }

    __getValueOrNull(fileContents, prop) {
        return (fileContents.hasOwnProperty(prop)) ? fileContents[prop]: null;
    }
}

export default OssimoFile;