import BaseConstruct from "./BaseConstruct";
import OssimoDatatypes from '../OssimoDatatype';

/**
 * RegEx pattern that can extract the method name and parameters from the
 * Ossimo method signature syntax.
 * 
 * Ex: 'foo(int param1, int param2)' => ['foo','int param1, int param2']
 */
const METHOD_SIGNATURE_PATTERN = /^([A-Za-z0-9]+)\(((?:\w+ \w+)(?:, (?:\w+ \w+))*)?\)$/;

/**
 * The abstract base class for all component types (module, controller, etc.).
 */
class BaseComponent extends BaseConstruct {
    /**
     * Creates a BaseComponent using an OssimoFile, and parses the defined
     * interface in the Ossimo configuration file.
     * 
     * @param {OssimoFile} ossimoFile 
     */
    constructor(ossimoFile) {
        super(ossimoFile);

        this.dependencies = ossimoFile.dependencies;
        this.interface = this.__parseInterface(ossimoFile.interface);
    }

    /**
     * Returns the corresponding OssimoDatatypes enum value that maps to the 
     * given datatype string.
     * 
     * @param {string} datatypeStr The datatype string defined in the
     * Ossimo configuration file
     * 
     * @returns {*} The OssimoDatatypes enum value
     */
    __mapDatatypes(datatypeStr) {
        switch(datatypeStr) {
            case 'string': return OssimoDatatypes.string;
            case 'int': return OssimoDatatypes.int32;
            default:
                throw new Error(`${datatypeStr} is not a valid type`);
        }
    }

    /**
     * Returns an object representing the interface that is defined in
     * the Ossimo configuration file.
     * 
     * @param {Object} ossimoInterface The raw object extracted from Ossimo
     * configuration file
     * 
     * @returns {Object} An object where the method name and parameters have
     * been parsed. 
     */
    __parseInterface(ossimoInterface) {
        if (ossimoInterface === null) {
            throw new Error("Interface is not defined");
        }

        const interfaceObj = {};

        for (const methodKey in ossimoInterface) {
            const matches = methodKey.match(METHOD_SIGNATURE_PATTERN);
            const methodName = matches[1];
    
            const paramStrings = matches[2].replace(', ',',').split(',');
            const methodParams = paramStrings.map(paramStr => {
                const paramTuple = paramStr.split(' ');
    
                return {
                    datatype: this.__mapDatatypes(paramTuple[0]),
                    name: paramTuple[1]
                }
            });

            const returnType = this.__mapDatatypes(ossimoInterface[methodKey]);

            interfaceObj[methodName] = {
                params: methodParams,
                returns: returnType
            };
        }

        return interfaceObj;
    }
}

export default BaseComponent;