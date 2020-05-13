const fs = require('fs');
import yaml from 'js-yaml';

class OssimoFile {
    /**
     * Inits and parses the ossimo.yml file specified by the filePath.
     * 
     * @param {string} filePath The path to the ossimo.yml to parse
     */
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
        this.description = this.__getValueOrNull(fileContents, 'description');
        this.interface = this.__getValueOrNull(fileContents, 'interface');
        this.implementation = this.__getValueOrNull(fileContents, 'implementation');
    }

    /**
     * Returns the value of the given property in the fileContents object, only
     * if the property exists. If it doesn't exist, return null.
     * 
     * @param {Object} fileContents The object to search through
     * @param {string} prop The property to search for 
     */
    __getValueOrNull(fileContents, prop) {
        return (fileContents.hasOwnProperty(prop)) ? fileContents[prop]: null;
    }
}

export default OssimoFile;