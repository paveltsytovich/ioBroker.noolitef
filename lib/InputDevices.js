const MTRF64Driver = require('mtrf64');

class InputDevice extends MTRF64Driver.RemoteControl {

	constructor(owner,controller,channel,mode,callback,name,mqtt = null) {
		super(controller,channel,mode);
		this.owner = owner;
		this.name = name;
		this.mqtt = mqtt;
		this.callback = callback;
	}
	onTurnOn() {
		this.callback.apply(this.owner,[this.name, 'onTurnOn']);
	}
	onTurnOff() {
		this.callback.apply(this.owner,[this.name, 'onTurnOff']);

	}
	onBrightDown() {
		this.callback(this.name, 'onBrightDown');
	}
	onBrightUp() {
		this.callback(this.name, 'onBrigthUp');
	}
	onExecuteScenario() {
		this.callback(this.name, 'onExecuteScenario');
	}
	onSaveScenario() {
		this.callback(this.name, '.onSaveScenario');
	}
	onStopReq() {
		this.callback(this.name, 'onStopReq');
	}
	onRollColour() {
		this.callback(this.name, 'onRollColour');
	}
	onSwitchColour() {
		this.callback(this.name, 'onSwtichColour');
	}
	onSwitchMode() {
		this.callback(this.name, 'onSwitchMode');
	}
	onSpeedBackMode() {
		this.callback(this.name, 'onSpeedBackMode');
	}
	onSendState(data) {
		this.callback(this.name, 'onSendState',data);
	}
	onSwitch() {
		this.callback(this.name, 'onSwitch');
	}
	onBrightBack() {
		this.callback(this.name, 'onBrightBack');
	}
	onLowBattery() {
		this.callback(this.name, 'onLowBattery');
	}
	onSensTempHumi(data) {
		this.callback(this.name, 'onSensTempHumi',data);
	}

}
class DoorSensorDevice extends  InputDevice {
	constructor(owner,controller,channel,mode,callback,name,mqtt = null) {
		super(owner,controller, channel, mode);
		this.name = name;
		this.mqtt = mqtt;
		this.callback = callback;
	}
	onTurnOn() {
		this.callback.apply(this.owner,[this.name, 'isOpen',true]);
	}
	onTurnOff() {
		this.callback.apply(this.owner,[this.name, 'isOpen',false]);

	}
}

class WaterSensorDevice extends  InputDevice {
	constructor(owner, controller,channel,mode,callback,name,mqtt = null) {
		super(owner,controller,channel,mode);
		this.name = name;
		this.mqtt = mqtt;
		this.callback = callback;
	}
	onTurnOn() {
		this.callback(this.name, 'Alaram',true);
	}
	onTurnOff() {
		this.callback(this.name, 'Alarm',false);

	}
}

class MotionSensorDevice extends  InputDevice {
	constructor(owner, controller,channel,mode,callback,name,mqtt = null) {
		super(owner, controller,channel,mode);
		this.name = name;
		this.mqtt = mqtt;
		this.callback = callback;
	}
	onTurnOn() {
		this.callback(this.name, 'MotionDetect',true);
	}
	onTurnOff() {
		this.callback(this.name, 'MotionDetect',false);

	}
}

module.exports.DoorSensorDevice = DoorSensorDevice;
module.exports.MotionSensorDevice = MotionSensorDevice;
module.exports.WaterSensorDevice = WaterSensorDevice;