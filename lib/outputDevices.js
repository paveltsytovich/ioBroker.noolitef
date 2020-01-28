// @ts-nocheck

/**
 *  @copyright Pavel Tsytovich, 2019
 *  Implement iobroker adapter for Noolite-F protocol
 */
/**
 * @typedef {import('../main').Noolitef} Noolitef
 * @typedef {import('../node_modules/mtrf64/MTRF64Controller').MTRF64Controller} MTRF64Controller
 */
const MTRF64Driver =  require('mtrf64');
/**
 * Proxy between IOBroker and low level noolite driver for output devices
 */
class OutputDevice extends MTRF64Driver.Relay {
	/**
	 * Constructor of this class
	 * @param {Noolitef} owner - owner of this object
	 * @param {MTRF64Controller} controller  - controller for operate low level driver
	 * @param {number} channel - address of this device in NooliteF system
	 * @param {number} mode - mode of this device 
	 * @param {function} callback - callback from IOBroker adapter for sync changes
	 * @param {string} name - name of device
	 */
	constructor(owner,controller,channel,mode,callback,name) {
		super(controller,channel,mode);
		this._owner = owner;
		this._callback = callback;
		this._name = name;
	}
	/**
	 * Execute command by low-level driver
	 */
	turnOn() {
		super.turnOn();
		if(this._callback)
			this._callback.apply(this._owner,[this._name,'brightness',100]);
	}
	/**
	 * Execute command by low-level driver
	 */
	turnOff() {
		super.turnOff();
		if(this._callback)
			this._callback.apply(this._owner,[this._name,'brightness',0]);

	}
	/**
	 * Execute command by low-level driver
	 * @param {number} brightness - brightness of light
	 */
	setBrightness(brightness) {
		super.setBrightness(brightness);
		if(!this._callback)
			return;
		this._callback.apply(this._owner,[this._name,'status',brightness > 0]);
	}
	/**
	 * Execute command by low-level driver
	 * @param {number} r - red part of color
	 * @param {number} g - green part of color
	 * @param {number} b - blue part of color
	 */
	setColor(r,g,b) {
		super.setColor(r,g,b);
		if(!this._callback)
			return;
		if(r != 0 || g != 0 || b != 0)
			this._callback.apply(this._owner,[this._name,'status',true]);
		else
			this._callback.apply(this._owner,[this._name,'status',false]);
	}

}
/**
 * Special class for registry of output device
 */
class OutputDevicesController {

	/**
	 * Contructor of this class
	 * @param {Noolitef} owner - IOBroker adapter who owned instance of this class
	 * @param {MTRF64Controller} controller - controller for link with low-level driver
	 */
	// @ts-ignore
	constructor(owner,controller) {
		/** @type {never[]} */
		this._devices = [];
		this._owner = owner;
		this._controller = controller;
		// @ts-ignore
		this._callback = null;
		/** @type {{ channel: any; state: any; data: any; }[]} */
		this._queue = [];
		this._handler = this._processRequest.bind(this);
		this._lock = false;
		this._timeOut = null;
	}
	/**
	 * Device factory method
	 * @param {number} channel - channel number in Noolite-F protocol
	 * @param {number} mode - mode Noolte or NooliteF
	 * @param {any} callback
	 */
	createDevice(channel,mode,name='',callback = null) {
		// @ts-ignore
		this._devices[channel ] = new OutputDevice(this._owner, 
			this._controller,channel,mode,callback,name);
	}
	/**
	 * Get device from registry by channel number
     * @param {number} channel - channel number in Noolite-F protocol
     */
	getDeviceByChannel(channel) {
		if(channel < 0)
			throw new Error('bad channel number');
		return this._devices[channel];
	}
	/**
	 * Put command in queue
     * @param {number} channel - address in Noolite-F protocol
     * @param {string} stateName - state name reflection to NooliteF command
     * @param {any} value - some data with command
     */
	processCommand(channel,stateName,value) {
		this._queue.push({channel: channel,
			state : stateName,
			data : value});
		if(!this._lock) {
			this._timeOut = setTimeout(this._handler,10);
			this._lock = true;
		}		
	}
	/**
	 * Execute command from queue. Internal method
	 */
	_processRequest() {
		const task = this._queue.shift();
		if(task === undefined) {
			this._lock = false;
			return;
		}
		let value = task.data;
		const device = this.getDeviceByChannel(task.channel);
		switch(task.state)
		{
			case 'status':
				if(value)
					device.turnOn();
				else 
					device.turnOff();
				break;
			case 'brightness':
				{
					if(value > 100) 
						value = 100;
					else if(value < 0)
						value = 0;
					const brightness = value / 100;
					device.setBrightness(brightness);
				}
				break;
			case 'currentColor':
				{
					const colorReg = /^#{1}([a-f\d]{6}\b)$/;
					const color = value.match(colorReg);
					if(color != null) 
					{	
						const red = parseInt(color[1].substring(0,2),16);
						const green = parseInt(color[1].substring(2,4),16);
						const blue = parseInt(color[1].substring(4,6),16);
						device.setColor(red,green,blue);
					}
				}
				break;
		}
		this._timeOut = setTimeout(this._handler,500);	
	}
	/**
	 * Shutdown controller
	 */
	close() {
		clearTimeout(this._timeOut);
	}
}

module.exports.OutputDevicesController = OutputDevicesController;