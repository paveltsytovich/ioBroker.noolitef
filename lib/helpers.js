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
				'def' : this.getDefaultValue(),
				'read': this.canRead(),
				'write': this.canWrite(),
				'role' : this.getRole(),
				'desc' : this.desc,
				'type' : this.getDataType()
			}
		};
		if(r.type == 'number') {
			r.min = this.getMin();
			r.max = this.getMax();
		}
		return r;	 
	}
	getDataType() {
		return 'boolean';
	}
	getTypeName() {
		return '';
	}
	canRead() {
		return true;
	}
	canWrite() {
		return true;
	}
	getRole() {
		return '';
	}
}

class Channel extends IObrokerHelper {
	constructor(role,namespace,name,address,desc = name) {
		super(namespace,name,desc);
		this.address = address;
		this.getRole = role;
		this.states = [];
	}
	getRole() {
		return this.getRole();
	}
	getObject() {
		const r = super.getObject();
		r.native = {'address' : this.address};
		return r;
	}
	getTypeName() {
		return 'channel';
	}
	getStates() {
		return this.states;
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
	getTypeName() {
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
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'status','boolean','state of light switcher'));
	}
	getRole() {
		return 'light';
	}
}
class Dimmer extends SimpleRelay {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'brightness','number','Light brightness ',true,0,100));
	}
}

class RGBRibbon extends Dimmer {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'currentColor','string','Current color of RGB ribbon'));
	}
}

class Sensor extends Channel {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'onLowBattery','boolean','state of sensor`s battery',false));
}

class RemoteControl extends Sensor {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
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
}
class DoorSensor extends Sensor {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'isOpen','boolean','The door sensor status',false));
	}
}
class AlarmSensor extends Sensor {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'Alarm','boolean','The door or water sensor status',false));
	}
}
class MotionSensor extends Sensor {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'MotionDetect','boolean','The motion sensor status',false));
	}
}
module.exports.SimpleRelay = SimpleRelay;
module.exports.RemoteControl = RemoteControl;
module.exports.Dimmer = Dimmer;
module.exports.RGBRibbon = RGBRibbon;
module.exports.DoorSensor = DoorSensor;
module.exports.AlarmSensor = AlarmSensor;
module.exports.MotionSensor = MotionSensor;