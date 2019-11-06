/**
 *  @copyright Pavel Tsytovich, 2019
 *  Implement iobroker adapter for Noolite-F protocol
 */
// @ts-nocheck
'use strict';

/*
 * Created with @iobroker/create-adapter v1.9.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const MTRF64Driver = require('mtrf64');
const SerialPort = require('serialport');
const Helper = require('./lib/helpers');
const InputDevices = require('./lib/inputDevices');
const Binding = require('./lib/bindingDevice');
const OutputDevices = require('./lib/outputDevices');



// Load your modules here, e.g.:
// const fs = require("fs");
/**
 * @class Noolitef
 * iobroker adapter main class
 */
class Noolitef extends utils.Adapter {

	/**
	 * @method constructor
	 * @param {Partial<ioBroker.AdapterOptions>} [options={}] - Options object. Use internal by iobroker
	 */
	constructor(options) {
		super({
			...options,
			name: 'noolitef',
		});
		this.serialport = null;
		this.controller = null;
		this.parser = null;
		this.lastcall = new Date().getTime();
		this.outputDevices = null;
		this.on('ready', this.onReady);
		this.on('objectChange', this.onObjectChange);
		this.on('stateChange', this.onStateChange);
		this.on('message', this.onMessage);
		this.on('unload', this.onUnload);

	}
	/**
	 * @method onReady
	 * Called by iobroker when databases are connected and adapter received configuration.
	 */
	onReady() {
		return new Promise((res) => {
			this.serialport = new SerialPort(this.config.devpath)
				// wait for the open event before claiming we are ready
				.on('open', () => res())
				// TODO: add other event handlers
			;
			// @ts-ignore
			if (!this.serialport.isOpen && !this.serialport.opening)
				this.serialport.open();
		}).then(() => {
			this.parser = this.serialport.pipe(new SerialPort.parsers.ByteLength({length: 17}));
			this.controller = new MTRF64Driver.Controller(this.serialport,this.parser);
			this.outputDevices = new OutputDevices.OutputDevicesController(this,this.controller);
			this._syncObject();
			this._mqttInit();
			this.subscribeStates('*');
			this.log.info('adapter ' + this.name + ' is ready');
		});

	}
	/**
	 * @method _syncObject
	 * Internal method for synchronize object with iobroker database
	 */
	_syncObject() {
		if(this.debug)
			this.log.info('start sync');
		const toDelete = [];
		const toAdd = [];
				
		if(this.config.devices) {
			this.getForeignObjects(this.namespace +'.*','channel',(err,objects) => {
				if(err) {
					this.log.error('No exits object in iobroker database');
				}
				this.config.devices.forEach(element => {
					toAdd.push(element);
				});
				for(const c in objects) {				
					toDelete.push(objects[c]._id);
					for(const o of toAdd) {
						if(this.namespace + '.' + o.name  == objects[c]._id) {
							toDelete.pop();			
							break;
						}						
					}					
				}					
				setImmediate(this._syncDelete.bind(this),toDelete);
				setImmediate(this._syncAdd.bind(this),toAdd);
			});
		}
	}
	/**
 * @method _syncDelete
 * Internal method for remove object from iobroker database if object has been removed from config adapter
 * @param {Array} objects - object`s array for remove
 */

	_syncDelete(objects) {
		for(const c of objects) {
			this.deleteChannel(this.namespace + '.' + c);
		}
	}
	/**
 * @method _syncAdd
 * Internal method for add object to iobroker datavase if object is new in config
 * @param {Array} objects  - object`s array for add
 */
	_syncAdd(objects) {
		let channel = undefined;
		for(const k in objects) {
			const c = objects[k];
			switch(parseInt(c.type)) {
				case 0: //On-Off Switcher
					channel = new Helper.OnOffCompactControl(this.namespace,c.name,c.channel,c.desc);
					new InputDevices.InputDevice(this,this.controller,c.channel,0,
						this._handleInputEvent,c.name);
					break;

				case 1: //On and Off keypad
					channel = new Helper.OnOffSeparatellyControl(this.namespace,c.name,c.channel,c.desc);
					new InputDevices.InputDevice(this,this.controller,c.channel,0,
						this._handleInputEvent,c.name);					
					break;

				case 2://Scenario button
					channel = new Helper.ScenarioControl(this.namespace,c.name,c.channel,c.desc);
					new InputDevices.InputDevice(this,this.controller,c.channel,0,
						this._handleInputEvent,c.name);
					break;

				case 3://RGB remote control
					channel = new Helper.RGBControl(this.namespace,c.name,c.channel,c.desc);
					new InputDevices.InputDevice(this,this.controller,c.channel,0,
						this._handleInputEvent,c.name);
					break;

				case 4://Door Sensor
					channel = new Helper.DoorSensor(this.namespace,c.name,c.channel,c.desc);
					new InputDevices.DoorSensorDevice(this,this.controller,c.channel,0,
						this._handleInputEvent,c.name);
					break;

				case 5://Water Sensor
					channel = new Helper.WaterSensor(this.namespace,c.name,c.channel,c.desc);
					new InputDevices.WaterSensorDevice(this,this.controller,c.channel,0,
						this._handleInputEvent,c.name);
					break;

				case 6://Motion Sensor
					channel = new Helper.MotionSensor(this.namespace,c.name,c.channel,c.desc);
					new InputDevices.MotionSensorDevice(this,this.controller,c.channel,0,
						this._handleInputEvent,c.name);
					break;

				case 7://Thermo Sensor
					this.log.warn('Thermo sensor not supported in this version');
					continue;

				case 8://Switch
					channel = new Helper.SimpleRelay(this.namespace,c.name,c.channel,c.desc);
					this.outputDevices.createDevice(parseInt(c.channel),parseInt(c.protocol));
					break;

				case 9://Dimmer
					channel = new Helper.Dimmer(this.namespace,c.name,c.channel,c.desc);
					this.outputDevices.createDevice(parseInt(c.channel),parseInt(c.protocol),c.name,
						this._handleOutputEvent);
					break;
				
				case 10://RGB
					channel = new Helper.RGBRibbon(this.namespace,c.name,c.channel,c.desc);
					this.outputDevices.createDevice(parseInt(c.channel),parseInt(c.protocol),c.name,
						this._handleOutputEvent);
					break;

				default:
					continue;				
			}
			const r = channel.getObject();
			this.setForeignObject(r._id,r);
			for(const s of channel.getStates()) {
				this.setForeignObject(s._id,s);
			}
		}
	}
	/**
	 * @method _mqttInit
	 * Internal method for mqtt initialize
	 * @description in this version this method not yet implemented
	 */
	_mqttInit() {
		//TO DO for future
	}
	/**
	 * @method _handleOutputEvent
	 * Internal method for handle event while state change by adapter
	 */
	_handleOutputEvent(name, property,data) {
		const stateName = this.namespace + '.' + name.trim() + '.' + property;
		if(this.debug)
			this.log.info('handle output event for ' + stateName + ' with data ' + data);
		this.setState(stateName,{val: data, ack: true});
	}
	/**
	 * @method _handleInputEvent
	 * Internal method for handle event from input Noolite-F device
	 * @param {string} name - base state path
	 * @param {string} property - state was changed
	 * @param {any} data - data for state
	 */
	_handleInputEvent(name, property,data = null) {
		const d = new Date().getTime();
		if(d - this.lastcall < 1000) 
			return;
		this.lastcall = d;
		const stateName = this.namespace + '.' + name.trim() + '.' + property;
		if(this.debug)
			this.log.info('handle input events for ' + stateName + ' with data ' + data);
		if(data === null)
			this.setState(stateName, {val: true, ack: true});	
		else 
			this.setState(stateName, {val: data, ack: true});	
	}
	/**
	 * @method onUnload
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	async onUnload(callback) {
		try {
			if (this.serialport && this.serialport.isOpen) {
				await this.serialport.close();
			}
			delete this.serialport;
			this.log.info('cleaned everything up...');
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * @method onStateChange
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	async onStateChange(id, state) {
		if(this.debug)
			this.log.info('state change from ' + id + 'with ' + JSON.stringify(state));
		if(!state || state.ack) 
			return;
		const deviceId = id.substring(0,id.lastIndexOf('.'));
		const stateId = id.substring(id.lastIndexOf('.')+1);
		const device = await (this.getObjectAsync(deviceId));
		const channel = device.native.address;
		this.outputDevices.processCommand(channel,stateId,state.val);
	}
 
	/**
	 * @method onMessage
	 * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	 * Using this method requires "common.message" property to be set to true in io-package.json
	 * @param {ioBroker.Message} obj
	 */
	onMessage(obj) {
		if(this.debug)
			this.log.info(JSON.stringify(obj));
		if (typeof obj === 'object' && obj.message) {
			const msg = JSON.parse(obj.message);
			if (obj.command === 'Bind') {
				this.log.info('Bind command');
				
				const result = Binding.Pairing(this.controller, parseInt(msg.type), 
					parseInt(msg.channel),parseInt(msg.protocol));
				
				// Send response in callback if required
				if (obj.callback) 
					this.sendTo(obj.from, obj.command, result, obj.callback);
			}
			else if (obj.command == 'Unbind') {
				this.log.info('Unbind command');
				const result = Binding.Unpairing(this.controller,parseInt(msg.type),
					parseInt(msg.channel),parseInt(msg.protocol));
				if (obj.callback) 
					this.sendTo(obj.from, obj.command, result, obj.callback);
			}
		}
	}
}

// @ts-ignore
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<ioBroker.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Noolitef(options);
} else {
	// otherwise start the instance directly
	new Noolitef();
}
