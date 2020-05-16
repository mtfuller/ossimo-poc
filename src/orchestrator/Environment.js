import fs from 'fs';

class Environment {
    constructor() {
        this.sections = {}
    }

    addSection(sectionName, data) {
        this.sections[sectionName] = data;
    }

    build(filepath) {
        let str = "";
        for (const sectionName in this.sections) {
            str += `[${sectionName}]\n`

            const section = this.sections[sectionName];
            for (const prop in section) {
                const value = section[prop];
                str += `${prop}=${value}\n`
            }

            str += `\n`
        }

        fs.writeFileSync(filepath, str, {encoding: 'utf-8'});
        return filepath;
    }
}

export default Environment;