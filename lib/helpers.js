// @ts-nocheck
class IObrokerHelper
{

	constructor(namespace,name,desc = name) {
		this.namespace = namespace;
		this.name = name;
		this.desc = desc;
	}
	getObject() {
		let r =  {
			'type' : this.getType(),
			'common': {
				'name' : this.name,
				'read': this.canRead(),
				'write': this.canWrite(),
				'desc' : this.desc,
				'type' : this.getDataType()
			}
		};
		if(r.type == 'number') {
			r.min = this.getMin();
			r.max = this.getMax();
		}
		//if(this.getRole() != undefined)
		// r.common.role = this.getRole();
		return r;	 
	}
	getDataType() {
		return 'boolean';
	}
	getType() {
		return undefined;
	}
	canRead() {
		return true;
	}
	canWrite() {
		return true;
	}
	getRole() {
		return undefined;
	}
	getTypeCode() {
		return undefined;
	}
}

class Channel extends IObrokerHelper {
	constructor(namespace,name,address,desc,role) {
		super(namespace,name,desc);
		this.address = address;
		this.getRole = role;
		this.states = [];
	}
	getRole() {
		return this.role;
	}
	getObject() {
		const r = super.getObject();
		r.native = {'address' : this.address, 'type': this.getTypeCode()};
		return r;
	}
	getType() {
		return 'channel';
	}
	getStates() {
		let r = [];
		this.states.forEach(element => {
			r.push(element.getObject())
		});
		return r;
	}
}
class State extends IObrokerHelper {
	constructor(namespace,name ,dataType,desc = name,canChange = true,min = 0,max = 0) {
		super(namespace,name,desc);
		this.dataType = dataType;
		this.min = min;
		this.max = max;
		this.canChange = canChange;
	}
	getType() {
		return 'state';
	}
	getDataType() {
		return this.dataType;
	}
	canWrite() {
		return this.canChange;
	}


}
class SimpleRelay extends Channel {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'light.switch');
		this.states.push(new State(namespace,'status','boolean','state of light switcher'));
	}
	getRole() {
		return 'light';
	}
	getTypeCode() {
		return 0;
	}
}
class Dimmer extends SimpleRelay {
	constructor(namespace,name,address,desc,role = 'light.dimmer') {
		super(namespace,name,address,desc,role);
		this.states.push(new State(namespace,'brightness','number','Light brightness ',true,0,100));
	}
	getTypeCode() {
		return 3;
	}
}

class RGBRibbon extends Dimmer {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'light.color');
		this.states.push(new State(namespace,'currentColor','string','Current color of RGB ribbon'));
	}
	getTypeCode() {
		return 4;
	}
}

class Sensor extends Channel {
	constructor(namespace,name,address,desc,role) {
		super(namespace,name,address,desc,role);
		this.states.push(new State(namespace,'onLowBattery','boolean','state of sensor`s battery',false));
	}
}

class RemoteControl extends Sensor {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace,'onTurnOn','number','',false));
		this.states.push(new State(namespace,'onTurnOff','number','',false));
		this.states.push(new State(namespace,'onExecuteScenario','number','',false));
		this.states.push(new State(namespace,'onSaveScenario','number','',false));
		this.states.push(new State(namespace,'onStopReq','number','',false));
		this.states.push(new State(namespace,'onRollColour','number','',false));
		this.states.push(new State(namespace,'onSwitchColour','number','',false));
		this.states.push(new State(namespace,'onSwitch','string','number',false));
		this.states.push(new State(namespace,'onSensTempHumi','number','',false));
	}
	getTypeCode()  {
		return 0;
	}
}
class DoorSensor extends Sensor {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'sensor.door');
		this.states.push(new State(namespace,'isOpen','boolean','The door sensor status',false));
	}
	getTypeCode() {
		return 1;
	}
}
class WaterSensor extends Sensor {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'sensor.water');
		this.states.push(new State(namespace,'Alarm','boolean','The water sensor status',false));
	}
	getTypeCode() {
		return 2;
	}
}
class MotionSensor extends Sensor {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc,'sensor');
		this.states.push(new State(namespace,'MotionDetect','boolean','The motion sensor status',false));
	}
	getTypeCode() {
		return 6;
	}

}
module.exports.SimpleRelay = SimpleRelay;
module.exports.RemoteControl = RemoteControl;
module.exports.Dimmer = Dimmer;
module.exports.RGBRibbon = RGBRibbon;
module.exports.DoorSensor = DoorSensor;
module.exports.WaterSensor = WaterSensor;
module.exports.MotionSensor = MotionSensor;