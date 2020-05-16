import fs from 'fs';
import ncp from 'ncp';

/**
 * Removes the given directory, and every subdirectory and file inside it.
 * 
 * @param {string} dirToRemove 
 */
export function removeExistingDirectoryTree(dirToRemove) {
    let files = fs.readdirSync(dirToRemove);

    files.forEach((file) => {
        var currentPath = dirToRemove + "/" + file;
        if (fs.lstatSync(currentPath).isDirectory()) {
            removeExistingDirectoryTree(currentPath);
        } else {
            fs.unlinkSync(currentPath);
        }
    });

    fs.rmdirSync(dirToRemove);
}

/**
 * Copy the entire directry from the source to the target path.
 * 
 * @param {string} sourcePath The path to the source directory 
 * @param {string} targetPath The path to the target directory
 * @param {Object} options An object that specifies certain parameters of the
 *  copy operation
 */
export async function copyEntireDirectory(sourcePath, targetPath, options = {
    depth: 16
}) {
    return new Promise((resolve, reject) => {
        ncp.limit = options.depth;

        ncp(sourcePath, targetPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve()
        });
    });
}

/**
 * Creates a new directory if that path doesn't exist.
 * 
 * @param {string} dirPath The path to the directory to create
 */
export function createDirectoryIfNoneExist(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}