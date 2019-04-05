/* const path = require('path');
const { tests,utils } = require('@iobroker/testing');
// @ts-ignore
const FakeSerialPort = require('serialport/test');

FakeSerialPort.Binding.createPort('/dev/ttyUSB1',{ echo: false, record: true,autoOpen: false });
// Run unit tests - See https://github.com/ioBroker/testing for a detailed explanation and further options

// @ts-ignore
tests.unit(path.join(__dirname, '..'), {
	allowedExitCodes: [11],
	additionalMockedModules: {
		'serialport': FakeSerialPort
	},
	overwriteAdapterConfig(config) {
		config.devices[0] = {'type':0, 'channel':2, protocol: 0, 'name': 'testRemoteControl'};
		
		config.devpath = '/dev/ttyUSB1';
		return config;

	},
	defineAdditionalTests() {
	    // @ts-ignore
	    const { adapter, database } = utils.unit.createMocks();
		it('State should be correct change after receive packet from device', () => {
			
			
		});        
	},
	defineMockBehavior(adapter) {
		console.log(JSON.stringify(adapter));
	}
});
 */