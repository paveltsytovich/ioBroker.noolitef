const MTRF64Driver =  require('mtrf64');

class OutputDevice extends MTRF64Driver.Relay {
	/**
     * @param {any} owner
     * @param {any} controller
     * @param {any} channel
     * @param {any} mode
     * @param {any} callback
     */
	constructor(owner,controller,channel,mode,callback) {
		super(controller,channel,mode);
		this._owner = owner;
		this._callback = callback;
	}
}

class OutputDevicesRegistry {

	/**
     * @param {any} owner
     * @param {any} controller
     */
	constructor(owner,controller,callback = null) {
		/** @type {never[]} */
		this._devices = [];
		this._owner = owner;
		this._controller = controller;
		this._callback = callback;
	}
	/**
     * @param {string | number} channel
     * @param {any} mode
     */
	createDevice(channel,mode) {
		this._devices[channel ] = new OutputDevice(this._owner, 
			this._controller,channel,mode,this._callback);
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
		const device = this.getDeviceByChannel(channel);
		switch(stateName)
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
					const red = (0xFF & value >> 16) / 100;
					const green = (0xFF & value >> 8) / 100;
					const blue = (0xFF & value) / 100;
					device.setColor(red,green,blue);
				}
				break;
		}
		
	}
}

module.exports.OutputDevicesRegistry = OutputDevicesRegistry;