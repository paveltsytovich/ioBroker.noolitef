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
		const { assertObjectExists } = utils.unit.createAsserts(database, adapter);
		describe('sync test',() => {
			afterEach(() => {
				adapter.resetMockHistory();
				database.clear();
				
			});
			it('Device objects is exists in database after sync', () => {
				assertObjectExists('noolitef.0.testlamp');
				assertObjectExists('noolitef.0.testRemoteControl');
				assertObjectExists('noolitef.0.testDoor');
				assertObjectExists('noolitef.0.testWater');
				assertObjectExists('noolitef.0.testDimmer');
				assertObjectExists('noolitef.0.testRgb');
			
			});
			it('Lamp object is correct', ()=> {
				assertObjectExists('noolitef.0.testlamp');
				assertObjectExists('noolitef.0.testlamp.status');
				assertObjectExists('noolitef.0.testlamp.channel');
			});
			it('Remote control is correct', () => {
				assertObjectExists('noolitef.0.testRemoteControl.lowBattery');
				assertObjectExists('noolitef.0.testRemoteControl.command');
				assertObjectExists('noolitef.0.testRemoteControl.channel');
			});
			it('Door sensor is correct',()=> {
				assertObjectExists('noolitef.0.testDoor.lowBattery');
				assertObjectExists('noolitef.0.testDoor.isOpen');
				assertObjectExists('noolitef.0.testDoor.channel');
			});
			it('Water sensor is correct', () => {
				assertObjectExists('noolitef.0.testWater.lowBattery');
				assertObjectExists('noolitef.0.testWater.alarm');
				assertObjectExists('noolitef.0.testWater.channel');
			});
			it('Dimmer is correct', () => {
				assertObjectExists('noolitef.0.testDimmer.status');
				assertObjectExists('noolitef.0.testDimmer.brightness');
				assertObjectExists('noolitef.0.testDimmer.channel');
			});
			it('RGB controller is correct', () => {
				assertObjectExists('noolitef.0.testRgb.status');
				assertObjectExists('noolitef.0.testRgb.color');
				assertObjectExists('noolitef.0.testRgb.brightness');
				assertObjectExists('noolitef.0.testRgb.channel');
			});
		}); 
	},
	defineMockBehavior(adapter) {
		
	}
});
