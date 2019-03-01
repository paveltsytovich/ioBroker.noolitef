'use strict';

/*
 * Created with @iobroker/create-adapter v1.9.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const fs = require("fs");

class Noolitef extends utils.Adapter {

	/**
	 * @param {Partial<ioBroker.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'noolitef',
		});
		this.on('ready', this.onReady);
		this.on('objectChange', this.onObjectChange);
		this.on('stateChange', this.onStateChange);
		this.on('message', this.onMessage);
		this.on('unload', this.onUnload);
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {

		//TO DO

		// in this template all states changes inside the adapters namespace are subscribed
		this.subscribeStates('*');

	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			this.log.info('cleaned everything up...');
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed object changes
	 * @param {string} id
	 * @param {ioBroker.Object | null | undefined} obj
	 */
	onObjectChange(id, obj) {

		//TO DO
		// if (obj) {
		// 	// The object was changed
		// 	this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
		// } else {
		// 	// The object was deleted
		// 	this.log.info(`object ${id} deleted`);
		// }
	}

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {

        //TO DO

		// if (state) {
		// 	// The state was changed
		// 	this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		// } else {
		// 	// The state was deleted
		// 	this.log.info(`state ${id} deleted`);
		// }
	}

	/**
	 * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	 * Using this method requires "common.message" property to be set to true in io-package.json
	 * @param {ioBroker.Message} obj
	 */
	onMessage(obj) {
		this.log.info(JSON.stringify(obj));
		if (typeof obj === 'object' && obj.message) {
			if (obj.command === 'Bind') {
				// e.g. send email or pushover or whatever
				this.log.info('Bind command');

				// Send response in callback if required
				if (obj.callback) this.sendTo(obj.from, obj.command, 'OK', obj.callback);
			}
			else if(obj.command == 'Unbind') {
				this.log.info('Unbind command');
				if (obj.callback) this.sendTo(obj.from, obj.command, 'OK', obj.callback);

			}
		}
	}

}

// @ts-ignore
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<ioBroker.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Noolitef(options);
} else {
	// otherwise start the instance directly
	new Noolitef();
}