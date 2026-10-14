import courses from './courses.json';
export { courses };
export type Guide = { id: string; title: string; type: 'Tutorial' | 'Journal'; active?: boolean; projectIds: string[]; category: string; minutes: number; intro: string; sections: { title: string; body: string; code?: string }[]; sources: { title: string; url: string }[] };
export const guides: Guide[] = [
  {
    id:'first-arduino-circuit',title:'Your first Arduino circuit: a button and an LED',type:'Tutorial',projectIds:['FS-003','FS-007','FS-029'],category:'Fundamentals',minutes:15,
    intro:'Build a small input-and-output project with an UNO R3, and understand why the button reads LOW when pressed.',
    sections:[
      {title:'Parts and assumptions',body:'Use an Arduino UNO R3, USB data cable, breadboard, red LED, 330 ohm resistor, push button and jumper wires. This guide assumes the UNO R3’s 5 V logic. Other boards need their own pinout and voltage checks. Disconnect USB before changing wiring.'},
      {title:'Wiring',body:'Connect pin 8 to a 330 ohm resistor, the other end of the resistor to the LED anode, and the LED cathode to ground. Connect pin 2 to one side of the button and the opposite switching side to ground. Check the button’s connected terminal pairs with continuity mode while power is off. The sketch enables INPUT_PULLUP, so no external pull-up is needed for this basic lab.'},
      {title:'The sketch',body:'setup() configures the pins once. loop() continuously reads the button and updates the LED. A pressed button connects the input to ground, producing LOW. This level-based demo lights the LED while the button is held. A press counter would also need edge detection and debouncing.',code:'void setup() {\n  pinMode(8, OUTPUT);\n  pinMode(2, INPUT_PULLUP);\n}\nvoid loop() {\n  bool pressed = digitalRead(2) == LOW;\n  digitalWrite(8, pressed ? HIGH : LOW);\n}'},
      {title:'Test and troubleshoot',body:'Upload using the UNO board selection and the detected port. Press and release the button three times. The LED should follow the held state. If it never lights, inspect LED polarity and the series branch. If it stays lit, check button placement and the input’s ground connection. Never bypass the resistor.'},
      {title:'Extend the project',body:'Add Serial output for the raw button reading. Then design a counter that changes only on a stable press event. Record your wiring and test results. The Arduino workshop includes nonblocking timing and a reaction-timer capstone.'},
    ],sources:[{title:'Arduino UNO R3 documentation',url:'https://docs.arduino.cc/hardware/uno-rev3/'}],
  },
  {
    id:'plant-monitor-calibration',title:'A plant monitor needs calibration before a percentage',type:'Tutorial',projectIds:['FS-002','FS-006','FS-024'],category:'Sensors',minutes:12,
    intro:'Turn raw soil-probe readings into a documented relative index, and keep that index separate from scientific water-content claims.',
    sections:[
      {title:'Electrical checks first',body:'Identify the exact ESP32 development board and soil-probe model. Check the probe’s supply and output range against the ADC input specification. ESP32 GPIO is generally 3.3 V logic and is not 5 V tolerant. Use a documented ADC1 pin on the original ESP32 when Wi-Fi operates. Other ESP32 families differ.'},
      {title:'Create reproducible references',body:'Record repeated readings in two clearly described reference conditions. Keep probe placement and supply conditions consistent. A dry reference and a wet reference produce a relative index for that setup. Soil type, salts, temperature and placement can affect later readings.'},
      {title:'The conversion',body:'For dry = 2800 and wet = 1200, index = 100 × (dry − raw) / (dry − wet). A raw value of 2000 produces 50. Clamp the displayed index to 0–100 if needed, but keep the unclipped raw reading in the log. If both calibration values match, reject the calibration because the denominator is zero.'},
      {title:'A stable alert',body:'In a classroom example, enter the dry alert below index 30 and clear it above 40. Between those points, retain the last state. This hysteresis reduces repeated switching around one threshold. Missing data should produce a sensor-error state rather than clearing the alert.'},
      {title:'What to save',body:'Keep board variant, pin, ADC settings, calibration readings, dates and reference conditions. Test normal, dry, noisy and disconnected cases. These records make the readings explainable and help another learner repeat the experiment.'},
    ],sources:[{title:'Espressif ADC calibration',url:'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc/adc_calibration.html'}],
  },
  {
    id:'desktop-weather-station',title:'Desktop weather station: the I2C bring-up checklist',type:'Tutorial',projectIds:['FS-004','FS-023','FS-039'],category:'Sensors',minutes:12,
    intro:'Bring up a BME280 and display one verified measurement at a time before building the full interface.',
    sections:[
      {title:'Check the breakout, not just the sensor name',body:'A bare BME280 and a breakout board can have different supply arrangements. Identify the module, regulator and level-shifting features. Use a verified 3.3 V-compatible setup for ESP32. Choose the board-specific SDA and SCL pins from its official pinout. Disconnect power before wiring.'},
      {title:'Confirm the bus',body:'Connect common ground, the documented power input, SDA and SCL. Many modules already include pull-ups, so check before adding more. Run an I2C scanner. A responding address proves that something acknowledges on the bus, not that it is the correct sensor or driver.'},
      {title:'Verify one value',body:'Use a library that matches the device. Read a single measurement and confirm its unit. Pressure may appear in pascals or hectopascals according to the library. Displaying the raw number with the wrong unit creates an apparently plausible but incorrect result.'},
      {title:'Add the screen',body:'Bring up the OLED separately using its exact controller and I2C address. Check for address conflicts. Combine the sensor and display only after both work alone. Keep a serial log so a display problem cannot hide a sensor failure.'},
      {title:'Failure tests',body:'Disconnect the sensor with power off, then restart. The interface should show unavailable data. Check wrong address, incorrect pins and a failed initialization explicitly. Keep the last reading visibly stale if the design retains it.'},
    ],sources:[{title:'Bosch BME280 product documentation',url:'https://www.bosch-sensortec.com/products/environmental-sensors/humidity-sensors-bme280/'}],
  },
  {
    id:'obstacle-rover-tests',title:'Obstacle-avoiding rover: safe tests before autonomous movement',type:'Tutorial',projectIds:['FS-001','FS-005','FS-016'],category:'Robotics',minutes:15,
    intro:'Test power, direction, sensing and failure states in a controlled order before putting a rover on the floor.',
    sections:[
      {title:'Match the power stage',body:'Use the motor’s documented voltage and stall-current requirements to select a driver and supply. Peak driver current is not the same as continuous capacity. A GPIO pin cannot power a motor. Follow the exact driver breakout’s power, ground and truth-table instructions.'},
      {title:'First motor test',body:'Raise the wheels and keep a physical power switch reachable. Test one motor at a low control setting, then verify each direction. Label physical forward after observing it. Stop or coast before reversing in this workshop. Keep wiring clear of the wheels.'},
      {title:'Distance as a measurement',body:'Using 343 m/s as an approximate sound speed, distance = speed × echo time / 2. A 1000 microsecond echo gives about 17.15 cm. Test a flat target at known distances. Treat a missing echo as unknown data, not as proof that the path is clear. Level shift a 5 V echo before an ESP32 input if the module requires it.'},
      {title:'Explicit movement states',body:'Write forward, stop, reverse and turn states with bounded exits. Continue checking safety conditions during movement. Test the logic with synthetic distances while motors remain disabled. An invalid sensor reading must lead to the documented stop condition.'},
      {title:'Acceptance demonstration',body:'Record startup, normal movement, obstacle detection, missing echo and manual power removal. A rover that navigates one obstacle but has no failure tests remains a demonstration prototype. Preserve the test record with the firmware version.'},
    ],sources:[{title:'TI DRV8833 datasheet',url:'https://www.ti.com/lit/ds/symlink/drv8833.pdf'}],
  },
  {
    id:'reaction-timer',title:'Reaction timer: nonblocking timing and false starts',type:'Tutorial',projectIds:['FS-008','FS-049'],category:'Fundamentals',minutes:10,
    intro:'Design the timer’s behavior first, then use millis() to measure the interval between the ready signal and a valid press.',
    sections:[
      {title:'Four states',body:'Waiting ignores normal result calculation and detects a false start. Ready begins when the LED lights and stores the start timestamp. Result stores the first accepted press interval. False-start reports the early press and waits for a deliberate restart.'},
      {title:'Elapsed time',body:'Use unsigned long values and elapsed-time subtraction. The expression now − startTime gives the interval in milliseconds using unsigned arithmetic. Keep the loop short so button processing and display updates can run together.'},
      {title:'A minimal timing pattern',body:'This snippet illustrates a nonblocking periodic LED. A complete reaction timer adds states, a debounced button and a restart action.',code:'unsigned long previous = 0;\nbool ledOn = false;\nvoid setup() { pinMode(8, OUTPUT); }\nvoid loop() {\n  unsigned long now = millis();\n  if (now - previous >= 500) {\n    previous = now; ledOn = !ledOn;\n    digitalWrite(8, ledOn);\n  }\n}'},
      {title:'Test the edge cases',body:'Try a valid press, an early press, a held button and a second press after a result. The measured interval includes the system’s input processing and debounce behavior. Treat it as an educational system measurement rather than a medical or scientific reaction test.'},
    ],sources:[{title:'Arduino Blink Without Delay',url:'https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/'}],
  },
  {
    id:'iot-telemetry-contract',title:'Your first IoT dashboard starts with a data contract',type:'Tutorial',projectIds:['FS-006','FS-020','FS-047','FS-050'],category:'IoT',minutes:12,
    intro:'A useful dashboard explains where a value came from, what unit it uses, and whether it is still current.',
    sections:[
      {title:'A small message',body:'Define schema_version, device_id, sequence, sample time, measurement units and validity. Keep receipt time separate from sample time. A sample can arrive late after buffering and still be structurally valid.'},
      {title:'Validate before display',body:'Reject missing required fields and invalid types. Treat missing measurements distinctly from a real zero. Preserve the validation result in the log. A plausible number does not establish that the message came from an authorized device.'},
      {title:'Freshness and duplicates',body:'Choose a documented freshness limit for the exercise. Mark readings stale after that age. MQTT QoS 1 allows duplicates, so use message identity when processing could create a repeated effect. A retained message can be old.'},
      {title:'The practical test',body:'Send valid, malformed, duplicate and delayed synthetic messages to a workshop dashboard. Disconnect the publisher briefly. Verify that the display distinguishes current, stale, invalid and unavailable data before connecting real sensing hardware.'},
    ],sources:[{title:'OASIS MQTT 5.0 specification',url:'https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html'}],
  },
  {
    id:'choose-kit-or-assembled',title:'Choosing a kit or an assembled project',type:'Journal',projectIds:[],category:'Project planning',minutes:5,
    intro:'Choose the format according to what you want to learn and how much setup you want to perform.',
    sections:[{title:'A kit gives you the build process',body:'An unassembled kit suits learners who want to identify parts, wire the circuit and upload code. Check the included components, required tools and software prerequisites. Assembly and troubleshooting are part of the learning experience.'},{title:'An assembled project changes the starting point',body:'A ready-built project can help you focus on behavior, measurements and extensions. Ask what setup, calibration and documentation it includes. Assembled does not imply that every future sensor, software environment or use case needs no configuration.'},{title:'Extra components need compatibility checks',body:'Choose parts by electrical, mechanical and software requirements rather than appearance. Voltage, current, interface and connector details matter. Golden Spark can confirm compatibility and the final price through the order conversation.'}],sources:[],
  },
  {
    id:'ai-workflow-first-step',title:'Before adding AI, write down the workflow',type:'Journal',projectIds:[],category:'AI & Automation',minutes:6,
    intro:'A clear process makes it easier to decide where AI helps and where a deterministic rule is enough.',
    sections:[{title:'The event and the outcome',body:'State what starts the process, what data arrives and what a successful result means. Identify the person responsible for exceptions. A summary or draft has a different release decision from a sent message or updated financial record.'},{title:'The uncertain step',body:'Use AI for a bounded task that benefits from interpretation or generation. Keep schema validation, resource ownership and required approvals in the application. Model output should receive appropriate checks before it can cause a side effect.'},{title:'The repeat event',body:'Retries and duplicate triggers are normal operating conditions. Use a stable event ID and an atomic claim or uniqueness rule before actions that should occur once. Test failure and recovery instead of assuming a successful first execution establishes reliability.'}],sources:[{title:'n8n error handling',url:'https://docs.n8n.io/build/flow-logic/handle-errors-gracefully'}],
  },
];
