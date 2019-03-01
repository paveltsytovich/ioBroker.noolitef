const path = require('path');
const { tests,utils } = require('@iobroker/testing');

const { adapter, database } = utils.unit.createMocks();
const { assertObjectExists } = utils.unit.createAsserts(database, adapter);

// Run unit tests - See https://github.com/ioBroker/testing for a detailed explanation and further options
tests.unit(path.join(__dirname, '..'), {
    allowedExitCodes: [11],
    defineAdditionalTests() {
        
    }
});
