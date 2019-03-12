const path = require('path');
const { tests,utils } = require('@iobroker/testing');
const FakeSerialPort = require('serialport/test');

FakeSerialPort.Binding.createPort('/dev/ttyUSB0',{ echo: false, record: true,autoOpen: false });
// Run unit tests - See https://github.com/ioBroker/testing for a detailed explanation and further options
tests.unit(path.join(__dirname, '..'), {
	allowedExitCodes: [11],
	additionalMockedModules: {
		'serialport': FakeSerialPort
	},
	defineAdditionalTests() {
	    const { adapter, database } = utils.unit.createMocks();
		const { assertObjectExists } = utils.unit.createAsserts(database, adapter);
		it('work', () => {
			adapter.setForeignState('noolitef.0',{val:2, ack: true});
			//adapter.setForeignStateChanged('noolitef.0');
			//adapter.createState('value1',{val:2, ack: true});
			
		});        
	},
	defineMockBehavior(db,adapter) {
		//console.log(JSON.stringify(adapter));
	}
});
