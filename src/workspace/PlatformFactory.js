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
export function platformFactory(platformString) {
    return require(`../platforms/${platformString}`);
}