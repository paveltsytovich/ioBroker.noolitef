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
	constructor(namespace,name ,dataType,desc = name,min = 0,max = 0) {
		super(namespace,name,desc);
		this.dataType = dataType;
		this.min = min;
		this.max = max;
	}
	getTypeName() {
		return 'state';
	}
	getDataType() {
		return this.dataType;
	}

}
class Switcher extends Channel {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'status','boolean','state of light switcher'));
	}
	getRole() {
		return 'light'
	}
}
class Dimmer extends Switcher {
	constructor(namespace,name,address,desc = name) {
		super(super(namespace,name,address,desc);
		this.states.push(new State(namespace,'brightness','number','Light brightness ',0,100))
	}
}

class Sensor extends Channel {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
	}
	canWrite() {
		return false;
	}
}
class DoorSensor extends Sensor {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'isOpen','boolean','The door sensor status'))
	}
}
class AlarmSensor extends Channel {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'Alarm','boolean','The door or water sensor status'))
	}
}
class MotionSensor extends Channel {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.states.push(new State(namespace,'MotionDetect','boolean','The motion sensor status'))
	}
}