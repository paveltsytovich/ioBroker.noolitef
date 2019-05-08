// @ts-nocheck
class IObrokerObject
{

	constructor(namespace,name,desc = name) {
		this.namespace = namespace;
		this.name = name;
		this.desc = desc;
	}
	getObject() {
		let r =  {
			'type' : this.getTypeName(),
			'common': {
				'name' : this.name,
				'def' : this.getDefaultValue(),
				'read': this.canRead(),
				'write': this.canWrite(),
				'role' : this.getRole(),
				'desc' : this.desc
			}
		};
		if(r.type == 'number') {
			r.min = this.getMin();
			r.max = this.getMax();
		}
	return r;	 
	}
	getTypeName() {
		return ''
	}
	canRead() {
		return true;
	}
	canWrite() {
		return true;
	}
	getRole() {
		return ""
	}
}

class Channel extends IObrokerObject {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,desc);
		this.address = address;
		this.isOutput = isOutput;
	}
	getObject() {
		let r = super.getObject();
		r.native = {'address' : this.address};
		return r;
	}
	getTypeName() {
		return 'channel';
	}
	getStates() {
		return [];
	}
}
class State extends IObrokerObject {
	constructor(namespace,name ,type,desc = name,min = 0,max = 0) {
		super(namespace,name,desc);
		this.type = type;
		this.min = min;
		this.max = max;
	}
	getTypeName() {
		return 'state';
	}
}
class Switcher extends Channel {
	constructor(namespace,name,address,desc = name) {
		super(namespace,name,address,desc);
		this.getStates.push(new State(namespace,'status'))
	}
}