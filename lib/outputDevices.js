const MTRF64Driver =  require('mtrf64');

class OutputDevice extends MTRF64Driver.Relay {
	/**
	 * @param {any} owner
	 * @param {any} controller
	 * @param {any} channel
	 * @param {any} mode
	 * @param {any} callback
	 * @param {string} name
	 */
	constructor(owner,controller,channel,mode,callback,name) {
		super(controller,channel,mode);
		this._owner = owner;
		this._callback = callback;
		this._name = name;
	}
	turnOn() {
		super.turnOn();
		if(this._callback)
			this._callback.apply(this._owner,['brightness',100]);
	}
	turnOff() {
		super.turnOff();
		if(this._callback)
			this._callback.apply(this._owner,['brightness',0]);

	}
	/**
	 * @param {any} brightness
	 */
	setBrightness(brightness) {
		super.setBrightness(brightness);
		if(!this._callback)
			return;
		this._callback.apply(this._owner,[this._name,'status',brightness > 0]);
	}
	/**
	 * @param {any} r
	 * @param {any} g
	 * @param {any} b
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

class OutputDevicesController {

	/**
	 * @param {any} owner
	 * @param {any} controller
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
	}
	/**
	 * @param {number} channel
	 * @param {any} mode
	 * @param {any} callback
	 */
	createDevice(channel,mode,name='',callback = null) {
		// @ts-ignore
		this._devices[channel ] = new OutputDevice(this._owner, 
			this._controller,channel,mode,callback,name);
	}
	/**
     * @param {number} channel
     */
	getDeviceByChannel(channel) {
		if(channel < 0)
			throw new Error('bad channel number');
		return this._devices[channel];
	}
	/**
     * @param {any} channel
     * @param {any} stateName
     * @param {any} value
     */
	processCommand(channel,stateName,value) {
		this._queue.push({channel: channel,
			state : stateName,
			data : value});
		if(!this._lock) {
			setTimeout(this._handler,10);
			this._lock = true;
		}		
	}
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
		setTimeout(this._handler,500);	
	}
}

module.exports.OutputDevicesController = OutputDevicesController;