const MTRF64Driver = require('mtrf64');

class SensorDevice extends MTRF64Driver.RemoteControl {

	constructor(controller,channel,mode,callback,name,mqtt = null) {
		super(controller,channel.mode);
		this.name = name;
		this.mqtt = mqtt;
		this.callback = callback;
	}
	onTurnOn() {
		this.callback(this.name, 'onTurnOn');
	}
	onTurnOff() {
		this.callback(this.name, 'onTurnOff');

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

module.exports.SensorDevice = SensorDevice;