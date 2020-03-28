/**
 *  @copyright Pavel Tsytovich, 2019
 *  Implement iobroker adapter for Noolite-F protocol
 *  Helper class for generate iobroker`s object
 */
// @ts-nocheck
/**
 * Base class for object`s generator
 */
class IObrokerHelper
{
/**
 * Class Constructor
 * @param {string} namespace - namespace for iobroker adapter
 * @param {string} name  - name of state
 * @param {string} desc  - state description
 * @param {string} role  - state role
 */
	constructor(namespace,name,desc = name,role) {
		this.namespace = namespace;
		this.name = name;
		this.desc = desc;
		this.role = role;
	}
	/**
	 * 
	 * Get iobroker object from helper object
	 */
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
		return r;	 
	}
	/**
	 * 
	 * Get type name for iobroker object. By default - boolean
	 */
	getDataType() {
		return 'boolean';
	}
	/**
	 * 
	 * Get iobroker`s type
	 */
	getType() {
		return undefined;
	}
	/**
	 * 
	 * Return true if state is readable
	 */
	canRead() {
		return true;
	}
	/**
	 * 
	 * Return true if state is writable
	 */
	canWrite() {
		return true;
	}
	/**
	 * 
	 * Return role of state in iobroker
	 */
	getRole() {
		return this.role;
	}
	/**
	 * 
	 * Return code type of state
	 */
	getTypeCode() {
		return undefined;
	}
}
/**
 *
 * Representive channel in IOBroker database
 */
class Channel extends IObrokerHelper {
	/**
	 * Constructor of this class
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 * @param {string} role - role in IObroker
	 */
	constructor(namespace,name,address,desc,role) {
		super(namespace,name,desc,role);
		this.address = address;
		this.states = [];
	}
	/**
	 * Get iobroker object for channel from helper object include states
	 */	
	getObject() {
		const r = super.getObject();
		r.native = {'address' : this.address, 'type': this.getTypeCode()};
		return r;
	}
	/**
	 * Get iobroker`s type
	 */
	getType() {
		return 'channel';
	}
	/**
	 * Get state array for channel
	 */
	getStates() {
		const r = [];
		this.states.forEach(element => {
			r.push(element.getObject());
		});
		return r;
	}
}
/**
 * Representive state in IOBroker database
 */
class State extends IObrokerHelper {
	/**
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {string} dataType - Data type for this state in IOBroker database
	 * @param {string} desc - description of channel
	 * @param {string} role - role in IObroker
	 * @param {boolean} canChange - can change this state by user code
	 * @param {number} min - min value for number type of state
	 * @param {number} max - max value for number type of state
	 */
	constructor(namespace,name ,dataType,desc = name,role='button',canChange = false,min = 0,max = 0) {
		super(namespace,name,desc,role);
		this.dataType = dataType;
		this.min = min;
		this.max = max;
		this.canChange = canChange;
	}
	/**
	 * Get iobroker`s type
	 */
	getType() {
		return 'state';
	}
	/**
	 * 
	 * Get type name for iobroker object. By default - boolean
	 */
	getDataType() {
		return this.dataType;
	}
	/**
	 * 
	 * Return true if state is writable
	 */
	canWrite() {
		return this.canChange;
	}
	/**
	 * Get iobroker object for state from helper object
	 */	
	getObject() {
		const r = super.getObject();
		//r.parent = this.namespace;
		return r;
	}
}
/**
 * Representive simple relay
 */
class SimpleRelay extends Channel {
	/**
	 * Constructor of this class
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 */
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace + '.' + name,'status','boolean','state of light switcher','switch',true));
	}
	/**
	 * 
	 * Return code type of state
	 */
	getTypeCode() {
		return 0;
	}
}
/**
 * Representive dimmer
 */
class Dimmer extends SimpleRelay {
	/**
	 * Constructor of this class
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 */
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'light.dimmer');
		this.states.push(new State(namespace + '.' + name,'brightness','number','Light brightness ','level.dimmer',true,0,100));
	}
	/**
	 * 
	 * Return code type of state
	 */
	getTypeCode() {
		return 3;
	}
}
/**
 * Representive RGB LED ribbon
 */
class RGBRibbon extends Dimmer {
	/**
	 * Constructor of this class
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 */
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'light.color');
		this.states.push(new State(namespace + '.' + name,'currentColor','string','Current color of RGB ribbon','level.color.rgb',true));
	}
	/**
	 * 
	 * Return code type of state
	 */
	getTypeCode() {
		return 4;
	}
}
/**
 * Representive abstract sensor
 * @classdesc this class should be use only for create specific sensor by inheritance
 */
class Sensor extends Channel {
	/**
	 * Constructor of this class
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 * @param {string} role - role in IObroker
	 */
	constructor(namespace,name,address,desc,role) {
		super(namespace,name,address,desc,role);
		this.states.push(new State(namespace + '.' + name,'onLowBattery','boolean','state of sensor`s battery','sensor.alarm.power'));
	}
	/**
	 * 
	 * Return code type of state
	 */
	getTypeCode() {
		return 0;
	}
}
/**
 * Representative Noolite remote control with one button for on and off command
 */
class OnOffCompactControl extends Sensor {
	/**
	 * Constructor of this class
 	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 */
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace + '.' + name,'onSwitch','boolean','Fire if short press On/Off button'));
		this.states.push(new State(namespace + '.' + name,'onBrightBack','boolean','Fire if long press On/Off button'));
		this.states.push(new State(namespace + '.' + name,'onStopReq','boolean','Fire if long press On/Off button'));
	}
}
/**
 * Representive Noolite remote control with separately buttons for on and off command
 */
class OnOffSeparatellyControl extends Sensor {
	/**
	 * Constructor for this class
     * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 */
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace + '.' + name,'onTurnOn','boolean','Fire, if short press On button'));
		this.states.push(new State(namespace + '.' + name,'onTurnOff','boolean','Fire if short press Off button'));
		this.states.push(new State(namespace + '.' + name,'onBrightDown','boolean','Fire, if long press Off button'));
		this.states.push(new State(namespace + '.' + name,'onBrightUp','boolean','Fire if long press On button'));
		this.states.push(new State(namespace + '.' + name,'onStopReq','boolean','Fire if long press On or Off button'));
	}
}
/**
 * Representive Noolite remote control with scenario button
 */
class ScenarioControl extends Sensor {
	/**
	 * Constructor for this class
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 */
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace + '.' + name,'onExecuteScenario','boolean','Fire if short press scenario button'));
		this.states.push(new State(namespace + '.' + name,'onSaveScenario','boolean','Fire if save scenario require'));
	}
}
/**
 * Representive Noolite remote control for RGB LED ribbon
 */
class RGBControl extends OnOffCompactControl {
	/**
	 * Constructor for this class
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 */
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'switch');
		this.states.push(new State(namespace + '.' + name,'onRollColour','boolean','Fire if press roll colour button'));
		this.states.push(new State(namespace + '.' + name,'onSwitchColour','boolean','Fire if press switch colour button'));
		this.states.push(new State(namespace + '.' + name,'onSwitchMode','boolean','Fire if long press switch colour button'));
	}
}
/**
 * Representive Noolite door sensor
 */
class DoorSensor extends Sensor {
	/**
	 * Constructor for this class
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 */
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'sensor.door');
		this.states.push(new State(namespace + '.' + name,'isOpen','boolean','The door sensor status','sensor.door'));
	}
	/**
	 * 
	 * Return code type of state
	 */
	getTypeCode() {
		return 1;
	}
}
/**
 * Representive Noolite water sensor
 */
class WaterSensor extends Sensor {
	/**
	 * Constructor for this class
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 */
	constructor(namespace,name,address,desc) {
		super(namespace,name,address,desc,'sensor.water');
		this.states.push(new State(namespace + '.' + name,'Alarm','boolean','The water sensor status','sensor.alarm.flood'));
	}
	/**
	 * 
	 * Return code type of state
	 */
	getTypeCode() {
		return 2;
	}
}
/**
 * Representive Noolite motion detected sensor
 */
class MotionSensor extends Sensor {
	/**
	 * Constructor for this class
	 * @param {string} namespace - namespace of channel
	 * @param {string} name - name of channel
	 * @param {number} address - address of channel
	 * @param {string} desc - description of channel
	 */
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc,'sensor');
		this.states.push(new State(namespace + '.' + name,'MotionDetect','boolean','The motion sensor status','sensor.motion'));
		this.states.push(new State(namespace + '.' + name,'timeout','number','Timeout before relay sholud be off','value.interval'));
	}
	/**
	 * 
	 * Return code type of state
	 */
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
