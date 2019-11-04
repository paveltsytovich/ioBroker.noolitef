// @ts-nocheck

/**
 *  @copyright Pavel Tsytovich, 2019
 *  Implement iobroker adapter for Noolite-F protocol. Binding/Unbinding command
 */
const MTRF64Driver = require('mtrf64');
/**
 * 
 * @param {MTRF64Controller} controller - MTRF64 controller in low driver
 * @param {number} type  - type of device for bind/unbind
 * @param {number} channel - number of channel
 * @param {number} mode - protocol mode 
 */
function Pairing(controller,type,channel,mode) {
	let device = null;
	if(type < 8) {
		device = new MTRF64Driver.RemoteControl(controller,channel,mode);
	}
	else {
		device = new MTRF64Driver.Relay(controller,channel,mode);
	}
	device.bind();
	return true;
}
/**
 * 
 * @param {MTRF64Controller} controller  - MTRF64 controller in low driver
 * @param {*} type - type of device for bind/unbind
 * @param {*} channel - number of channel
 * @param {*} mode - protocol mode 
 */
function Unpairing(controller, type,channel, mode) {
	let device = null;
	if(type < 8) {
		device = new MTRF64Driver.RemoteControl(controller,channel,mode);
	}
	else {
		device = new MTRF64Driver.Relay(controller,channel,mode);
	}
	device.unbind();
	return true;
}

module.exports.Pairing = Pairing;
module.exports.Unpairing = Unpairing;