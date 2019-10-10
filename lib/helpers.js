// @ts-nocheck
class IObrokerHelper
{

	constructor(namespace,name,desc = name,role) {
		this.namespace = namespace;
		this.name = name;
		this.desc = desc;
		this.role = role;
	}
	getObject() {
		const r =  {
			'_id' : this.namespace + '.' + this.name,
			'type' : this.getType(),
			'common': {
				'name' : this.desc,
				'read': this.canRead(),
				'write': this.canWrite(),
				'desc' : this.desc,
				'type' : this.getDataType(),
				'role' : this.getRole()
			},
			'native' : {}
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
		return this.role;
	}
	getTypeCode() {
		return undefined;
	}
}

class Channel extends IObrokerHelper {
	constructor(namespace,name,address,desc,role) {
		super(namespace,name,desc,role);
		this.address = address;
		this.states = [];
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
		const r = [];
		this.states.forEach(element => {
			r.push(element.getObject());
		});
		return r;
	}
}
class State extends IObrokerHelper {
	constructor(namespace,name ,dataType,desc = name,role='button',canChange = false,min = 0,max = 0) {
		super(namespace,name,desc,role);
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
	getObject() {
		const r = super.getObject();
		r.parent = this.namespace;
		return r;
	}


}
class SimpleRelay extends Channel {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace + '.' + name,'status','boolean','state of light switcher','switch',true));
	}

	getTypeCode() {
		return 0;
	}
}
class Dimmer extends SimpleRelay {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'light.dimmer');
		this.states.push(new State(namespace + '.' + name,'brightness','number','Light brightness ','level.dimmer',true,0,100));
	}
	getTypeCode() {
		return 3;
	}
}

class RGBRibbon extends Dimmer {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'light.color');
		this.states.push(new State(namespace + '.' + name,'currentColor','string','Current color of RGB ribbon','level.color.rgb',true));
	}
	getTypeCode() {
		return 4;
	}
}

class Sensor extends Channel {
	constructor(namespace,name,address,desc,role) {
		super(namespace,name,address,desc,role);
		this.states.push(new State(namespace + '.' + name,'onLowBattery','boolean','state of sensor`s battery','sensor.alarm.power'));
	}
	getTypeCode() {
		return 0;
	}
}

class OnOffCompactControl extends Sensor {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace + '.' + name,'onSwitch','boolean','Fire if short press On/Off button'));
		this.states.push(new State(namespace + '.' + name,'onBrightBack','boolean','Fire if long press On/Off button'));
		this.states.push(new State(namespace + '.' + name,'onStopReq','boolean','Fire if long press On/Off button'));
	}
}
class OnOffSeparatellyControl extends Sensor {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace + '.' + name,'onTurnOn','boolean','Fire, if short press On button'));
		this.states.push(new State(namespace + '.' + name,'onTurnOff','boolean','Fire if short press Off button'));
		this.states.push(new State(namespace + '.' + name,'onBrightDown','boolean','Fire, if long press Off button'));
		this.states.push(new State(namespace + '.' + name,'onBrightUp','boolean','Fire if long press On button'));
		this.states.push(new State(namespace + '.' + name,'onStopReq','boolean','Fire if long press On or Off button'));
	}
}
class ScenarioControl extends Sensor {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace + '.' + name,'onExecuteScenario','boolean','Fire if short press scenario button'));
		this.states.push(new State(namespace + '.' + name,'onSaveScenario','boolean','Fire if save scenario require'));
	}
}

class RGBControl extends OnOffCompactControl {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace + '.' + name,'onRollColour','boolean','Fire if press roll colour button'));
		this.states.push(new State(namespace + '.' + name,'onSwitchColour','boolean','Fire if press switch colour button'));
		this.states.push(new State(namespace + '.' + name,'onSwitchMode','boolean','Fire if long press switch colour button'));
	}
}
class DoorSensor extends Sensor {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'sensor.door');
		this.states.push(new State(namespace + '.' + name,'isOpen','boolean','The door sensor status','sensor.door'));
	}
	getTypeCode() {
		return 1;
	}
}
class WaterSensor extends Sensor {
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'sensor.water');
		this.states.push(new State(namespace + '.' + name,'Alarm','boolean','The water sensor status','sensor.alarm.flood'));
	}
	getTypeCode() {
		return 2;
	}
}
class MotionSensor extends Sensor {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc,'sensor');
		this.states.push(new State(namespace + '.' + name,'MotionDetect','boolean','The motion sensor status','sensor.motion'));
	}
	getTypeCode() {
		return 6;
	}

}
module.exports.SimpleRelay = SimpleRelay;
module.exports.OnOffCompactControl = OnOffCompactControl;
module.exports.OnOffSeparatellyControl = OnOffSeparatellyControl;
module.exports.ScenarioControl = ScenarioControl;
module.exports.RGBControl = RGBControl;
module.exports.Dimmer = Dimmer;
module.exports.RGBRibbon = RGBRibbon;
module.exports.DoorSensor = DoorSensor;
module.exports.WaterSensor = WaterSensor;
module.exports.MotionSensor = MotionSensor;
