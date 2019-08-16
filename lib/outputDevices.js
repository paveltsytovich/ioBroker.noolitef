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

class OutputDeviceRegistry {

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
     * @param {any} state
     * @param {any} value
     */
	processCommand(channel,state,value) {
		const device = this.getDeviceByChannel(channel);
		switch(state)
		{
			case 'status':
				if(value)
					device.turnOn();
				else 
					device.turnOff();
				break;
			case 'brightness':
				break;
		}
		
	}
}