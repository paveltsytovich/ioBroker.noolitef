# Device Setup List 

## Type of device

### On Off switcher

*On Off switcher* - The separatelly buttons for ON and OFF command object

This device have state:

* onTurnOn - set true if user press ON button
* onTurnOff - set true if user press OFF button
* onBrightUp - set true if user long press ON button
* onBrightDown - set true if user long press OFF button
* onStopReq - true when the user has stopped long pressing the buttons
* onLowBattery - set true if battery is low

### On and Off keypad

*On and Off keypad* - The button with both ON and OFF command object

This device have states:

* onSwitch - change true/false when user press this button
* onBrightBack - set true value if user long press this button
* onStopReq - true when the user has stopped long pressing the button
* onLowBattery - set true if battery is low

### Scenario button

*Scenario button* - The scenario button for preset noolite devices object

This device have states:

* onExecuteScenario - set true when user short press this button
* onSaveScenario - set true when user long press this button
* onLowBattery - set true if battery is low

### RGB Remote control

*RGB Remote control* - RGB remote control with on/off button, color select button and cycle color button object

* onSwitch - change true/false when user press ON/OFF button
* onSwitchMode - set true when user press _select mode_ button
* onSwitchColour - set true when user press _select colour_ button
* onBrightBack - set true when user long press ON/OFF button
* onStopReq - true when the user has stopped long pressing the ON/OFF button
* onLowBattery - set true if battery is low


  * 
* Door Sendor - The door sensor device object
* Water Sensor - The Water sensor device object
* Motion Sensor - The motion sensor device object
* Thermo Sensor - The thermo sensor. Not supported yet
* Switch - The simple relay object
* Dimmer - The relay with dimmer functional object
* RGB ribbon - The RGB controller object

## Device parameters in setup panel in Noolite-F adapter

* 

