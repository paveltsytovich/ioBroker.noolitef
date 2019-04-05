const path = require('path');
const { tests,utils } = require('@iobroker/testing');
// @ts-ignore
const FakeSerialPort = require('serialport/test');

FakeSerialPort.Binding.createPort('/dev/ttyUSB0',{ echo: false, record: true,autoOpen: false });
// Run unit tests - See https://github.com/ioBroker/testing for a detailed explanation and further options

// @ts-ignore
tests.unit(path.join(__dirname, '..'), {
	allowedExitCodes: [11],
	additionalMockedModules: {
		'serialport': FakeSerialPort
	},
	overwriteAdapterConfig(config) {
		config.devices[0] = {'type':5, 'channel':1, protocol: 0, 'name': 'testlamp'};
		config.devices[1] = {'type':0, 'channel':2, protocol: 0, 'name': 'testRemoteControl'};
		config.devices[2] = {'type':1, 'channel':3, protocol: 0, 'name': 'testDoor'};
		config.devices[3] = {'type':2, 'channel':4, protocol: 0, 'name': 'testWater'};
		config.devices[4] = {'type':3, 'channel':5, protocol: 0, 'name': 'testDimmer'};
		config.devices[5] = {'type':4, 'channel':6, protocol: 0, 'name': 'testRgb'};
		config.devpath = '/dev/ttyUSB0';
		return config;

	},
	defineAdditionalTests() {
	    // @ts-ignore
	    const { adapter, database } = utils.unit.createMocks();
		it('work', () => {
			adapter.setForeignState('noolitef.0',{val:2, ack: true});
			//adapter.setForeignStateChanged('noolitef.0');
			//adapter.createState('value1',{val:2, ack: true});
			
		});        
	},
	defineMockBehavior(adapter) {
		console.log(JSON.stringify(adapter));
	}
});
