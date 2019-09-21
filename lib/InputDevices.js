const MTRF64Driver = require('mtrf64');

class InputDevice extends MTRF64Driver.RemoteControl {

	constructor(owner,controller,channel,mode,callback,name,mqtt = null) {
		super(controller,channel,mode);
		this.owner = owner;
		this.name = name;
		this.mqtt = mqtt;
		this.callback = callback;
		controller.register(this);
	}
	onTurnOn() {
		this.callback.apply(this.owner,[this.name, 'onTurnOn']);
	}
	onTurnOff() {
		this.callback.apply(this.owner,[this.name, 'onTurnOff']);

	}
	onBrightDown() {
		this.callback.apply(this.owner,[this.name, 'onBrightDown']);
	}
	onBrightUp() {
		this.callback.apply(this.owner, [this.name, 'onBrigthUp']);
		
	}
	onExecuteScenario() {
		this.callback.apply(this.owner, [this.name, 'onExecuteScenario']);
	}
	onSaveScenario() {
		this.callback.apply(this.owner, [this.name, 'onSaveScenario']);  
	}
	onStopReq() {
		this.callback.apply(this.owner, [this.name, 'onStopReq']);
	}
	onRollColour() {
		this.callback.apply(this.owner, [this.name, 'onRollColour']);
	}
	onSwitchColour() {
		this.callback.apply(this.owner, [this.name, 'onSwitchColour']);
	}
	onSwitchMode() {
		this.callback.apply(this.owner, [this.name, 'onSwitchMode']);
	}
	onSpeedBackMode() {
		this.callback.apply(this.owner, [this.name, 'onSpeedBackMode']);
	}
	onSendState(data) {
		this.callback.apply(this.owner, [this.name, 'onSendState',data]);
	}
	onSwitch() {
		this.callback.apply(this.owner, [this.name, 'onSwitch']);
	}
	onBrightBack() {
		this.callback.apply(this.owner, [this.name, 'onBrightBack']);
	}
	onLowBattery() {
		this.callback.apply(this.owner, [this.name, 'onLowBattery']);
	}
	onSensTempHumi(data) {
		this.callback.apply(this.owner, [this.name, 'onSensTempHumi',data]);
	}

}
class DoorSensorDevice extends  InputDevice {
	constructor(owner,controller,channel,mode,callback,name,mqtt = null) {
		super(owner,controller, channel, mode,callback,name,mqtt);
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
		super(owner,controller,channel,mode,callback,name,mqtt);
	}
	onTurnOn() {
		this.callback.apply(this.owner,[this.name, 'Alaram',true]);
	}
	onTurnOff() {
		this.callback(this.owner, [this.name, 'Alarm',false]);

	}
}

class MotionSensorDevice extends  InputDevice {
	constructor(owner, controller,channel,mode,callback,name,mqtt = null) {
		super(owner, controller,channel,mode,callback,name,mqtt);
	}
	onTurnOn() {
		this.callback.apply(this.owner, [this.name, 'MotionDetect',true]);
	}
	onTurnOff() {
		this.callback.apply(this.owner, [this.name, 'MotionDetect',false]);

	}
}

module.exports.InputDevice = InputDevice;
module.exports.DoorSensorDevice = DoorSensorDevice;
module.exports.MotionSensorDevice = MotionSensorDevice;
module.exports.WaterSensorDevice = WaterSensorDevice;