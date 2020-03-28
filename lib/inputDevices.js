// @ts-nocheck
/**
 *  @copyright Pavel Tsytovich, 2019
 *  Implement iobroker adapter for Noolite-F protocol
 */
/**
 * @typedef { import("../main")} Nooolitef 
 * @typedef { import("../node_modules/mtrf64/MTRF64Controller")} MTRF64Controller
 */
const MTRF64Driver = require('mtrf64');
/**
 * Proxy between IOBroker and low level noolite driver for input devices
 */
class InputDevice extends MTRF64Driver.RemoteControl {

	/**
	 * Constructor for this class
	 * @param {Nooolitef} owner - owner of this object
	 * @param {MTRF64Controller} controller  - controller for operate low level driver
	 * @param {number} channel - address of this device in NooliteF system
	 * @param {number} mode - mode of this device 
	 * @param {function} callback - callback from IOBroker adapter for sync changes
	 * @param {string} name - name of device
	 * @param {*} mqtt - reference to mqtt client. NOT YET IMPLEMENTED!
	 */
	constructor(owner,controller,channel,mode,callback,name,mqtt = null) {
		super(controller,channel,mode);
		this.owner = owner;
		this.name = name;
		this.mqtt = mqtt;
		this.callback = callback;
		controller.register(this);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onTurnOn() {
		this.callback.apply(this.owner,[this.name, 'onTurnOn']);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onTurnOff() {
		this.callback.apply(this.owner,[this.name, 'onTurnOff']);

	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onBrightDown() {
		this.callback.apply(this.owner,[this.name, 'onBrightDown']);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onBrightUp() {
		this.callback.apply(this.owner, [this.name, 'onBrightUp']);
		
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onExecuteScenario() {
		this.callback.apply(this.owner, [this.name, 'onExecuteScenario']);
	}
	onSaveScenario() {
		this.callback.apply(this.owner, [this.name, 'onSaveScenario']);  
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onStopReq() {
		this.callback.apply(this.owner, [this.name, 'onStopReq']);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onRollColour() {
		this.callback.apply(this.owner, [this.name, 'onRollColour']);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onSwitchColour() {
		this.callback.apply(this.owner, [this.name, 'onSwitchColour']);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onSwitchMode() {
		this.callback.apply(this.owner, [this.name, 'onSwitchMode']);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onSpeedBackMode() {
		this.callback.apply(this.owner, [this.name, 'onSpeedBackMode']);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 * @param {any} data  - data receive with some command
	 */
	onSendState(data) {
		this.callback.apply(this.owner, [this.name, 'onSendState',data]);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onSwitch() {
		this.callback.apply(this.owner, [this.name, 'onSwitch']);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onBrightBack() {
		this.callback.apply(this.owner, [this.name, 'onBrightBack']);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onLowBattery() {
		this.callback.apply(this.owner, [this.name, 'onLowBattery']);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 * @param {any} data  - data receive with some command
	 */
	onSensTempHumi(data) {
		this.callback.apply(this.owner, [this.name, 'onSensTempHumi',data]);
	}
}
/**
 * Proxy between IOBroker and low level noolite driver for input Door sensor devices
 */
class DoorSensorDevice extends  InputDevice {
	/**
	 * Constructor for this class
	 * @param {Nooolitef} owner - owner of this object
	 * @param {MTRF64Controller} controller  - controller for operate low level driver
	 * @param {number} channel - address of this device in NooliteF system
	 * @param {number} mode - mode of this device 
	 * @param {function} callback - callback from IOBroker adapter for sync changes
	 * @param {string} name - name of device
	 * @param {*} mqtt - reference to mqtt client. NOT YET IMPLEMENTED!
	 */
	constructor(owner,controller,channel,mode,callback,name,mqtt = null) {
		super(owner,controller, channel, mode,callback,name,mqtt);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onTurnOn() {
		this.callback.apply(this.owner,[this.name, 'isOpen',true]);
	}
	/**
	 * manage callback. This  method use for link between  low-level driver and IOBroker`s state 
	 */
	onTurnOff() {
		this.callback.apply(this.owner,[this.name, 'isOpen',false]);
	}
}
/**
 * Proxy between IOBroker and low level noolite driver for input Water sensor devices
 */
class WaterSensorDevice extends  InputDevice {
	/**
	 * Contructor of this class
	 * @param {Nooolitef} owner - owner of this object
	 * @param {MTRF64Controller} controller  - controller for operate low level driver
	 * @param {number} channel - address of this device in NooliteF system
	 * @param {number} mode - mode of this device 
	 * @param {function} callback - callback from IOBroker adapter for sync changes
	 * @param {string} name - name of device
	 * @param {*} mqtt - reference to mqtt client. NOT YET IMPLEMENTED!
	 */
	constructor(owner, controller,channel,mode,callback,name,mqtt = null) {
		super(owner,controller,channel,mode,callback,name,mqtt);
	}
	onTurnOn() {
		this.callback.apply(this.owner,[this.name, 'Alaram',true]);
	}
	onTurnOff() {
		this.callback(this.owner, [this.name, 'Alarm',false]);

	}
}
/**
 * Proxy between IOBroker and low level noolite driver for input Motion detected sensor devices
 */
class MotionSensorDevice extends  InputDevice {
	/**
	 * Contructor of this class
	 * @param {Nooolitef} owner - owner of this object
	 * @param {MTRF64Controller} controller  - controller for operate low level driver
	 * @param {number} channel - address of this device in NooliteF system
	 * @param {number} mode - mode of this device 
	 * @param {function} callback - callback from IOBroker adapter for sync changes
	 * @param {string} name - name of device
	 * @param {*} mqtt - reference to mqtt client. NOT YET IMPLEMENTED!
	 */
	constructor(owner, controller,channel,mode,callback,name,mqtt = null) {
		super(owner, controller,channel,mode,callback,name,mqtt);
	}
	onTurnOn() {
		this.callback.apply(this.owner, [this.name, 'MotionDetect',true]);
	}
	onTurnOff() {
		this.callback.apply(this.owner, [this.name, 'MotionDetect',false]);

	}
	onTemporaryOn(data) {
		this.callback.apply(this.owner,[this.name, 'MotionDetect',data]);
	}
}

module.exports.InputDevice = InputDevice;
module.exports.DoorSensorDevice = DoorSensorDevice;
module.exports.MotionSensorDevice = MotionSensorDevice;
module.exports.WaterSensorDevice = WaterSensorDevice;