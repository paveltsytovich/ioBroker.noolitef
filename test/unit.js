const expect = require('chai').expect;
const chai = require('chai');
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
		config.devices[0] = {'type':5, 'channel':1, protocol: 0, 'name': 'testlamp','desc' : 'Test lamp'};
		config.devices[1] = {'type':0, 'channel':2, protocol: 0, 'name': 'testRemoteControl','desc': 'Test Remote control'};
		config.devices[2] = {'type':1, 'channel':3, protocol: 0, 'name': 'testDoor','desc' : 'Test Door sensor'};
		config.devices[3] = {'type':2, 'channel':4, protocol: 0, 'name': 'testWater','desc':'Test water sensor'};
		config.devices[4] = {'type':3, 'channel':5, protocol: 0, 'name': 'testDimmer','desc' : 'Test dimmer'};
		config.devices[5] = {'type':4, 'channel':6, protocol: 0, 'name': 'testRgb','desc' : 'Test RGB Controller'};
		config.devpath = '/dev/ttyUSB0';
		return config;

	},
	predefinedObjects: [
		{
			'_id': 'noolitef.0.testlamp', // e.g. "hm-rpc.0.JEQ0205612:1"
			'type': 'channel',
			// @ts-ignore
			'parent': 'noolitef.0',         // e.g. "hm-rpc.0.JEQ0205612"
			 'children': [
				'noolitef.0.testlamp.status',
				'noolitef.0.testlamp.channel'
			 ],
			'common': {
				'name':  'testlamp',      // mandatory, default _id ??
				'role':  'light.switch',          // optional   default undefined
				'desc':  'fill comment for test purpose'                      // optional,  default undefined
			}
		 },
		 {
			'_id': 'noolitef.0.badlamp', // e.g. "hm-rpc.0.JEQ0205612:1"
			'type': 'channel',
			// @ts-ignore
			'parent': 'noolitef.0',         // e.g. "hm-rpc.0.JEQ0205612"
			 'children': [
				'noolitef.0.badlamp.status',
				'noolitef.0.badlamp.channel'
			 ],
			'common': {
				'name':  'badlamp',      // mandatory, default _id ??
				'role':  'light.switch',          // optional   default undefined
				'desc':  'fill comment for test purpose'                      // optional,  default undefined
			}
		 }
	],
	predefinedStates: {
		'noolitef.0.testlamp.status' : {'val' :false, 'ack':false},
		'noolitef.0.testlamp.channel' : {'val' :1, 'ack' : false},
		'noolitef.0.badlamp.status' : {'val' :false, 'ack':false},
		'noolitef.0.badlamp.channel' : {'val' :1, 'ack' : false}

	},
	defineAdditionalTests() {	    
		// @ts-ignore
		const { adapter, database } = utils.unit.createMocks();
		const { assertObjectExists } = utils.unit.createAsserts(database, adapter);
		describe('Correct hierarhical', () => {
			it('getobject should be correct object', () => {
				const actual = database.getObject('noolitef.0.testlamp');
				const expected = {
					'_id': 'noolitef.0.testlamp', 
					'type': 'channel',
					'parent': 'noolitef.0',         
					 'children': [
						'noolitef.0.testlamp.status',
						'noolitef.0.testlamp.channel'
					 ],
					'common': {
						'name':  'testlamp',      
						'role':  'light.switch',          
						'desc':  ''                     
					}
				 };
				 expect(actual).deep.equal(expected);
			});
			it('getstate should be correct state', () => {
				const actual = database.getState('noolitef.0.testlamp.channel');
				const expected = { 'val': 1, ack : false};
				expect(actual).deep.equal(expected);
			});
		});
		describe('sync test',() => {
			afterEach(() => {
				//adapter.resetMockHistory();
				//database.clear();
				
			});
			it('Device objects is exists in database after sync', () => {
				assertObjectExists('noolitef.0.testlamp');
				assertObjectExists('noolitef.0.testRemoteControl');
				assertObjectExists('noolitef.0.testDoor');
				assertObjectExists('noolitef.0.testWater');
				assertObjectExists('noolitef.0.testDimmer');
				assertObjectExists('noolitef.0.testRgb');
				
			
			});
			it('Device object should be correct remove from iobroker database',() => {
				let result = database.hasObject('noolitef.0.badlamp');
				result |= database.hasObject('noolitef.0.badlamp.status');

				chai.assert(!result);

			});
			it('Lamp object is correct', ()=> {
				assertObjectExists('noolitef.0.testlamp');
				assertObjectExists('noolitef.0.testlamp.status');
				assertObjectExists('noolitef.0.testlamp.channel');
			});
			it('Remote control is correct', () => {
				assertObjectExists('noolitef.0.testRemoteControl.lowBattery');
				//assertObjectExists('noolitef.0.testRemoteControl.command');
				//assertObjectExists('noolitef.0.testRemoteControl.channel');
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
		describe('Change state in iobroker database should be send correct command to port', () => {

		});
	},
	defineMockBehavior(adapter) {
		
	}
});
