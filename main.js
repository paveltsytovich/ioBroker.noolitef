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
const InputDevices = require('./lib/InputDevices');
const Binding = require('./lib/bindingDevice');
const OutputDevices = require('./lib/outputDevices');


// Load your modules here, e.g.:
// const fs = require("fs");

class Noolitef extends utils.Adapter {

	/**
	 * @param {Partial<ioBroker.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'noolitef',
		});
		this._serialport = null;
		this._controller = null;
		this._parser = null;
		this._instances = [];
		this._lastcall = new Date().getTime();
		this._outputDevices = null;
		this.on('ready', this.onReady);
		this.on('objectChange', this.onObjectChange);
		this.on('stateChange', this.onStateChange);
		this.on('message', this.onMessage);
		this.on('unload', this.onUnload);

	}
	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	onReady() {
		return new Promise((res) => {
			this._serialport = new SerialPort(this.config.devpath)
				// wait for the open event before claiming we are ready
				.on('open', () => res())
				// TODO: add other event handlers
			;
			// @ts-ignore
			if (!this._serialport.isOpen && !this._serialport.opening)
				this._serialport.open();
		}).then(() => {
			this._parser = this._serialport.pipe(new SerialPort.parsers.ByteLength({length: 17}));
			this._controller = new MTRF64Driver.Controller(this._serialport,this.parser);
			this._outputDevices = new OutputDevices.OutputDevicesRegistry(this,this._controller);
			this._syncObject();
			this._mqttInit();
			this.subscribeStates('*');
			this.log.info('adapter ' + this.name + ' is ready');
		});

	}
	_syncObject() {
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
						if(o  == objects[c]._id) {
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
	_syncDelete(objects) {
		for(const c of objects) {
			this.deleteChannel(this.namespace + '.' + c);
		}
	}
	_syncAdd(objects) {
		let channel = undefined;
		let i = 0;
		for(const k in objects) {
			const c = objects[k];
			switch(parseInt(c.type)) {
				case 0:
					channel = new Helper.RemoteControl(this.namespace,c.name,c.channel,c.desc);
					this.log.info('RemoteControl');
					this._instances[i] = new InputDevices.InputDevice(this,this._controller,c.channel,0,
						this._handleInputEvent,c.name);
					this._controller.register(this._instances[i]);
					i++;
					break;
				case 1:
					channel = new Helper.DoorSensor(this.namespace,c.name,c.channel,c.desc);
					this.log.info('DoorSensor');
					this._instances[i] = new InputDevices.DoorSensorDevice(this,this._controller,c.channel,0,
						this._handleInputEvent,c.name);
					this._controller.register(this._instances[i]);
					i++;
					break;
				case 2:
					channel = new Helper.WaterSensor(this.namespace,c.name,c.channel,c.desc);
					this.log.info('WaterSensor');
					this._instances[i] = new InputDevices.WaterSensorDevice(this,this._controller,c.channel,0,
						this._handleInputEvent,c.name);
					this._controller.register(this._instances[i]);
					i++;
					break;
				case 3:
					channel = new Helper.Dimmer(this.namespace,c.name,c.channel,c.desc);
					this._outputDevices.createDevice(parseInt(c.channel),parseInt(c.protocol));
					break;
				case 4:
					channel = new Helper.RGBRibbon(this.namespace,c.name,c.channel,c.desc);
					this._outputDevices.createDevice(parseInt(c.channel),parseInt(c.protocol));
					break;
				case 5:
					channel = new Helper.SimpleRelay(this.namespace,c.name,c.channel,c.desc);
					this._outputDevices.createDevice(parseInt(c.channel),parseInt(c.protocol));
					break;				
				case 6:
					channel = new Helper.MotionSensor(this.namespace,c.name,c.channel,c.desc);
					this.log.info('MotionSensor');
					this._instances[i] = new InputDevices.MotionSensorDevice(this,this._controller,c.channel,0,
						this._handleInputEvent,c.name);
					this._controller.register(this._instances[i]);
					i++;
					break;
				case 7:
					this.log.warn('Thermo sensor not supported in this version');
					continue;	
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
	_mqttInit() {

	}
	_handleInputEvent(name, property,data = null) {
		const d = new Date().getTime();
		if(d - this._lastcall < 1000) 
			return;
		this._lastcall = d;
		const stateName = this.namespace + '.' + name.trim() + '.' + property;
		this.log.info('handle input events for ' + stateName + ' with data ' + data);
		if(data === null)
			this.setState(stateName, {val: true, ack: true});	
		else 
			this.setState(stateName, {val: data, ack: true});	
	}
	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	async onUnload(callback) {
		try {
			if (this._serialport && this._serialport.isOpen) {
				await this._serialport.close();
			}
			delete this._serialport;
			this.log.info('cleaned everything up...');
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed object changes
	 * @param {string} id
	 * @param {ioBroker.Object | null | undefined} obj
	 */
	onObjectChange(id, obj) {
		this.log.info('object change from ' + id + 'with ' + JSON.stringify(obj));
		//TO DO
		// if (obj) {
		// 	// The object was changed
		// 	this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
		// } else {
		// 	// The object was deleted
		// 	this.log.info(`object ${id} deleted`);
		// }
	}

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	async onStateChange(id, state) {
		this.log.info('state change from ' + id + 'with ' + JSON.stringify(state));
		if(state && !state.ack) 
			return;
		const deviceId = id.substring(0,id.lastIndexOf('.')-1);
		const stateId = id.substring(id.lastIndexOf('.')+1);
		const device = await (this.getObjectAsync(deviceId));
		const channel = device.native.address;
		this._outputDevices.processCommand(channel,stateId,state.val);
	}
 
	/**
	 * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	 * Using this method requires "common.message" property to be set to true in io-package.json
	 * @param {ioBroker.Message} obj
	 */
	onMessage(obj) {
		this.log.info(JSON.stringify(obj));
		if (typeof obj === 'object' && obj.message) {
			const msg = JSON.parse(obj.message);
			if (obj.command === 'Bind') {
				this.log.info('Bind command');
				
				const result = Binding.Pairing(this._controller, parseInt(msg.type), 
					parseInt(msg.channel),parseInt(msg.protocol));
				
				// Send response in callback if required
				if (obj.callback) 
					this.sendTo(obj.from, obj.command, result, obj.callback);
			}
			else if (obj.command == 'Unbind') {
				this.log.info('Unbind command');
				const result = Binding.Unpairing(this._controller,parseInt(msg.type),
				 parseInt(msg.channel),parseInt(msg.protocol));
				if (obj.callback) 
					this.sendTo(obj.from, obj.command, result, obj.callback);
			}
		}
	}
	_internal() {
		console.log('stub');
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
