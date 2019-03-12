const path = require('path');
const { tests,utils } = require('@iobroker/testing');
const FakeSerialPort = require('serialport/test');




// Run integration tests - See https://github.com/ioBroker/testing for a detailed explanation and further options
/* tests.integration(path.join(__dirname, '..'), {

	allowedExitCodes: [11],
	defineAdditionalTests(getHarness) {
		describe("Test setState", () => {

			it('Should work', () => {
				return new Promise(async (resolve) => {
					// Create a fresh harness instance each test!
					const harness = getHarness();
					// Start the adapter and wait until it has started
					await harness.startAdapterAndWait();

					//Perform the actual test:
					harness.setState("noolitef.0.value", {"val":1, "ack":true},() => {
						console.dir(resp);
						resolve();
					});
				});
			});
		});
	}
});
 */