
const MTRF64Driver = require('mtrf64');

function Pairing(controller,type,channel,mode) {
	let device = null;
	if(type in [0,1,2,6]) {
		device = new MTRF64Driver.RemoteControl(controller,channel,mode);
	}
	else {
		device = new MTRF64Driver.Relay(controller,channel,mode);
	}
	device.bind();
	return true;
}

function Unpairing(controller, type,channel, mode) {
	let device = null;
	if(type in [0,1,2,6]) {
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