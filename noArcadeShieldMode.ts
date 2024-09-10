namespace microcode {
    const enum UI_MODE {
        SENSOR_SELECTION,
        LOGGING
    };

    const enum UI_SENSOR_SELECT_STATE {
        ACCELERATION,
        TEMPERATURE,
        LIGHT,
        MAGNET,
        RADIO
    };

    const SENSOR_SELECTION_SIZE = 5;
    const SHOW_EACH_SENSOR_FOR_MS: number = 1000;

    export class NoArcadeShieldMode {
        private app: App;
        private uiMode: UI_MODE;
        private uiSensorSelectState: UI_SENSOR_SELECT_STATE;
        private dynamicSensorSelectionTriggered: boolean;
        private uiSensorSelectStateHasChanged: boolean;

        constructor(app: App) {
            this.app = app;
            this.uiMode = UI_MODE.SENSOR_SELECTION;
            this.uiSensorSelectState = UI_SENSOR_SELECT_STATE.ACCELERATION;
            this.uiSensorSelectStateHasChanged = false;

            // A Button
            input.onButtonPressed(1, () => {
                if (this.uiMode == UI_MODE.SENSOR_SELECTION) {
                    this.dynamicSensorSelectionTriggered = false;
                    this.uiSensorSelectStateHasChanged = true;

                    this.uiMode = UI_MODE.LOGGING;
                    this.log();
                }
            })

            // B Button
            input.onButtonPressed(2, () => {
                if (this.uiMode == UI_MODE.SENSOR_SELECTION) {
                    this.uiSensorSelectState = (this.uiSensorSelectState + 1) % SENSOR_SELECTION_SIZE
                    this.dynamicSensorSelectionTriggered = false;
                    this.uiSensorSelectStateHasChanged = true;
                }
            })

            this.dynamicSensorSelectionLoop();
            this.showSensorIcon();
        }


        private dynamicSensorSelectionLoop() {
            const dynamicInfo = [
                {sensor: new AccelerometerXSensor(), uiState: UI_SENSOR_SELECT_STATE.ACCELERATION, threshold: 0.25}, 
                {sensor: new AccelerometerYSensor(), uiState: UI_SENSOR_SELECT_STATE.ACCELERATION, threshold: 0.25}, 
                {sensor: new AccelerometerZSensor(), uiState: UI_SENSOR_SELECT_STATE.ACCELERATION, threshold: 0.25},
                {sensor: new LightSensor(),          uiState: UI_SENSOR_SELECT_STATE.LIGHT,        threshold: 0.75},
                {sensor: new MagnetXSensor(),        uiState: UI_SENSOR_SELECT_STATE.MAGNET,       threshold: 0.80}
            ];

            // Don't trigger the same sensor selection twice in a row:
            let ignore: boolean[] = dynamicInfo.map(_ => false);
            control.inBackground(() => {
                while (this.uiMode == UI_MODE.SENSOR_SELECTION) {
                    dynamicInfo.forEach((info, idx) => {
                        if (!ignore[idx] && info.sensor.getNormalisedReading() > info.threshold) {
                            this.uiSensorSelectState = info.uiState;
                            this.dynamicSensorSelectionTriggered = true;

                            ignore = dynamicInfo.map(_ => false);
                            ignore[idx] = true;
                            basic.pause(1000)
                            this.dynamicSensorSelectionTriggered = false;
                        }
                        basic.pause(100)
                    })
                    basic.pause(100)
                }
                return;
            })
        }

        private handleDynamicSensorSelection(waitTime: number) {
            this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(waitTime);
        }


        private waitUntilSensorSelectStateChange(time: number, check_n_times: number): boolean {
            const period = time / check_n_times;
            const initialState = this.uiSensorSelectState;
            let timeWaited = 0;

            for (let n = 0; n < check_n_times; n++) {
                if (this.uiSensorSelectState != initialState)
                    return false;

                basic.pause(period)
                timeWaited += period
            }
            return true;
        }

        private showSensorIcon() {
            this.dynamicSensorSelectionTriggered = false;

            while (true) {
                switch (this.uiSensorSelectState) {
                    case UI_SENSOR_SELECT_STATE.ACCELERATION: {
                        // basic.showLeds() requires a '' literal; thus the following is un-loopable: 

                        basic.showLeds(`
                            # # # . .
                            # # . . .
                            # . # . .
                            . . . # .
                            . . . . .
                        `);
                        if (!this.waitUntilSensorSelectStateChange((SHOW_EACH_SENSOR_FOR_MS / 3), 25)) break;

                        basic.showLeds(`
                            . . # . .
                            . . # . .
                            # # # # #
                            . # # # .
                            . . # . .
                        `);
                        if (!this.waitUntilSensorSelectStateChange((SHOW_EACH_SENSOR_FOR_MS / 3), 25)) break;

                        basic.showLeds(`
                            . . # . .
                            . . # # .
                            # # # # #
                            . . # # .
                            . . # . .
                        `);
                        if (!this.waitUntilSensorSelectStateChange((SHOW_EACH_SENSOR_FOR_MS / 3), 25)) break;
                    }
                        
                    case UI_SENSOR_SELECT_STATE.TEMPERATURE: {
                        basic.showLeds(`
                            # . . . .
                            . . # # .
                            . # . . .
                            . # . . .
                            . . # # .
                        `);
                        if (!this.waitUntilSensorSelectStateChange((SHOW_EACH_SENSOR_FOR_MS / 3), 25)) break;
                        break;
                    }

                    case UI_SENSOR_SELECT_STATE.LIGHT: {
                        basic.showLeds(`
                            . . . . .
                            . # # # .
                            . . # . .
                            . . . . .
                            . . # . .
                        `);
                        if (!this.waitUntilSensorSelectStateChange((SHOW_EACH_SENSOR_FOR_MS / 3), 25)) break;
                        
                        basic.showLeds(`
                            . # # # .
                            . # # # .
                            . # # # .
                            . . . . .
                            . . # . .
                        `);
                        if (!this.waitUntilSensorSelectStateChange((SHOW_EACH_SENSOR_FOR_MS / 3), 25)) break;
                        break;
                    }

                    case UI_SENSOR_SELECT_STATE.MAGNET: {
                        if (this.uiMode != UI_MODE.SENSOR_SELECTION) return;
                        if (this.uiSensorSelectState != UI_SENSOR_SELECT_STATE.MAGNET) break;
                        basic.showLeds(`
                            . # # # .
                            # # # # #
                            # # . # #
                            . . . . .
                            . . . . .
                        `)
                        if (!this.waitUntilSensorSelectStateChange((SHOW_EACH_SENSOR_FOR_MS / 3), 25)) break;

                        basic.showLeds(`
                            . # # # .
                            # # # # #
                            # # . # #
                            . . . . .
                            # # . # #
                        `)
                        if (!this.waitUntilSensorSelectStateChange((SHOW_EACH_SENSOR_FOR_MS / 3), 25)) break;
                        break;
                    }

                    case UI_SENSOR_SELECT_STATE.RADIO: {
                        if (this.uiMode != UI_MODE.SENSOR_SELECTION) return
                        basic.showLeds(`
                            . . . . .
                            . . . . .
                            . # # # .
                            # . . . #
                            . . # . . 
                        `);
                        if (!this.waitUntilSensorSelectStateChange((SHOW_EACH_SENSOR_FOR_MS / 3), 25)) break;
                        
                        basic.showLeds(`
                            . # # # .
                            # . . . #
                            . # # # .
                            # . . . #
                            . . # . .
                        `);
                        if (!this.waitUntilSensorSelectStateChange((SHOW_EACH_SENSOR_FOR_MS / 3), 25)) break;
                        break;
                    }

                    default:
                        return;
                }
                // basic.pause(100)
            }
        }

        private log() {
            const sensors = this.uiSelectionToSensors();
            let time = 0;

            let start = input.runningTime();
            while (true) {
                start = input.runningTime();
                sensors.forEach(sensor => {
                    datalogger.log(
                        datalogger.createCV("Sensor", sensor.getName()),
                        datalogger.createCV("Time (ms)", time),
                        datalogger.createCV("Reading", sensor.getReading()),
                        datalogger.createCV("Event", "N/A")
                    );
                });

                basic.showNumber((time / 1000));
                basic.pause(Math.max(0, 1000 - (input.runningTime() - start)));
                time += 1000;
            }
        }

        private uiSelectionToSensors(): Sensor[] {
            switch (this.uiSensorSelectState) {
                case UI_SENSOR_SELECT_STATE.ACCELERATION:
                    return [new AccelerometerXSensor(), new AccelerometerYSensor(), new AccelerometerZSensor()]

                case UI_SENSOR_SELECT_STATE.TEMPERATURE:
                    return [new TemperatureSensor()]

                case UI_SENSOR_SELECT_STATE.LIGHT:
                    return [new LightSensor()]

                case UI_SENSOR_SELECT_STATE.MAGNET:
                    return [new MagnetXSensor()]

                case UI_SENSOR_SELECT_STATE.RADIO:
                    new DistributedLoggingProtocol(this.app, false);
                    return []
            
                default:
                    return []
            }
        }
    }
}