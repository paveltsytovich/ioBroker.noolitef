// @ts-nocheck
class State
{

	constructor(namespace,address,name) {
		this.namespace = namespace;
		this.address = address;
		this.name = name;
	}
	getObject() {
		return  {
			'common': {
				'name' : this.name,
				'def' : this.getDefaultValue(),
				'read': this.canRead(),
				'write': this.canWrite(),
				'role' : this.getRole(),
				'desc' : this.getDesc(),
				'min' : this.getMin(),
				'max' : this.getMax(),
			}

		}
	}
}