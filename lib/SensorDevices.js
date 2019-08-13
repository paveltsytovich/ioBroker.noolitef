const MTRF64Driver = require('mtrf64');

class SensorDevice extends MTRF64Driver.RemoteControl {

	constructor(controller,channel,mode,callback,mqtt = null) {
		super(controller,channel.mode);
		this.mqtt = mqtt;
		this.callback = callback;
	}
	onTurnOn() {
		this.callback('onTurnOn');
	}
	onTurnOff() {
		this.callback('onTurnOff');

	}
	onBrightDown() {
		this.callback('onBrightDown');
	}
	onBrightUp() {
		this.callback('onBrigthUp');
	}
	onExecuteScenario() {
		this.callback('onExecuteScenario');
	}
	onSaveScenario() {
		this.callback('onSaveScenario');
	}
	onStopReq() {
		this.callback('onStopReq');
	}
	onRollColour() {
		this.callback('onRollColour');
	}
	onSwitchColour() {
		this.callback('onSwtichColour');
	}
	onSwitchMode() {
		this.callback('onSwitchMode');
	}
	onSpeedBackMode() {
		this.callback('onSpeedBackMode');
	}
	onSendState(data) {
		this.callback('onSendState',data);
	}
	onSwitch() {
		this.callback('onSwitch');
	}
	onBrightBack() {
		this.callback('onBrightBack');
	}
	onLowBattery() {
		this.callback('onLowBattery');
	}
	onSensTempHumi(data) {
		this.callback('onSensTempHumi',data);
	}

}

module.exports.SensorDevice = SensorDevice;