import BaseComponent from '../../core/constructs/BaseComponent';
import logger from '../../util/logger';

/**
 * Implements the BaseComponent class to build and deploy Ossimo controllers.
 */
class ControllerComponent extends BaseComponent {
    constructor(ossimoFile) {
        super(ossimoFile);

        logger.debug(`Parsing ${this.name} controller...`);

        this.components = [];

        this.delegation = this.__parseDelegation(this.ossimoFile.delegation);
    }


    __parseDelegation(ossimoDelegation) {
        if (ossimoDelegation === null) {
            throw new Error("Delegation is not defined");
        }

        let delegationObj = {};

        return delegationObj;
    }

    clean() {
        logger.info(`Cleaning ${this.name} controller...`);
    }

    async build() {
        logger.info(`Building ${this.name} controller...`);
    }

    isBuilt() {
        return false;
    }
}

export default ControllerComponent;