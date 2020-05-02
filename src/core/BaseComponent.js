import BaseConstruct from "./BaseConstruct";
const OssimoDatatypes = require('./OssimoDatatype');

const METHOD_SIGNATURE_PATTERN = /^([A-Za-z0-9]+)\(((?:\w+ \w+)(?:, (?:\w+ \w+))*)?\)$/;

class BaseComponent extends BaseConstruct {
    constructor(ossimoFile) {
        super(ossimoFile);

        this.interface = this.__parseInterface(ossimoFile.interface);
    }

    __mapDatatypes(datatypeStr) {
        switch(datatypeStr) {
            case 'string': return OssimoDatatypes.string; break;
            case 'int': return OssimoDatatypes.int32; break;
            default:
                throw new Error(`${datatypeStr} is not a valid type`);
        }
    }

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