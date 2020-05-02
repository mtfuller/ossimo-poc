const { expect } = require('chai');
const OssimoFileFactory
const OssimoFile = require('../../src/ossimo/core/OssimoFile');

describe('OssimoFile', function() {
    describe('#constructor()', function() {
        it('should throw an error if file doesn\'t exist', function() {
            expect(new OssimoFile('../_resources/this-file-does-not-exist.yml'))
                .to.throw(new Error('The specified file does not exist'));
        });

        it('should throw an error if yaml file is invalid', function() {
            expect(new OssimoFile('../_resources/invalid-yaml.yml'))
                .to.throw(new Error('Yaml file is invalid'));
        });

        it('should correctly initialize a project', function() {
            const projectFile = new OssimoFile('../_resources/sample.project.yml')
            
            expect(projectFile.constructor.name).to.equal("OssimoProjectFile");
            expect(projectFile.name).to.equal("SampleProject");
            expect(projectFile.description).to.equal("This is a sample description.");
        });

        it('should correctly initialize a component', function() {
            const componentFile = new OssimoFile('../_resources/sample.component.yml')            
            expect(componentFile.constructor.name).to.equal("OssimoComponentFile");
            expect(componentFile.name).to.equal("SampleComponent");

            // Validate interface
            expect(componentFile.interface).to.have.property('doubleNumber');
            const doubleNumberMethod = componentFile.interface.doubleNumber;
            expect(doubleNumberMethod).to.have.property('number');
            expect(doubleNumberMethod).to.have.lengthOf(1);
            expect(doubleNumberMethod.number).to.equal('int32');

            // Validate modules
            expect(componentFile.modules).to.have.property('default');
            const defaultModule = componentFile.modules.default;
            expect(defaultModule).to.have.property('platform');
            expect(defaultModule.platform).to.equal('python3');
            expect(defaultModule.entry).to.equal('src/main.py');
        });

        it('should correctly initialize an entity', function() {
            const entity = new OssimoFile('../_resources/sample.component.yml')  
        });
    });
  });