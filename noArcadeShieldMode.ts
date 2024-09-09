namespace microcode {
    const enum UI_MODE {
        SENSOR_SELECTION,
        CONFIRM_SELECTION
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
        private sensorHasBeenSelected: boolean;

        constructor(app: App) {
            this.app = app;
            this.uiMode = UI_MODE.SENSOR_SELECTION;
            this.uiSensorSelectState = UI_SENSOR_SELECT_STATE.ACCELERATION;
            this.sensorHasBeenSelected = false;

            control.onEvent(DAL.DEVICE_BUTTON_EVT_DOWN, DAL.DEVICE_ID_BUTTON_A, () => {
                this.dynamicSensorSelectionTriggered = false;

                if (this.uiMode == UI_MODE.SENSOR_SELECTION) {
                    this.sensorHasBeenSelected = true;
                    this.uiMode = UI_MODE.CONFIRM_SELECTION;
                }

                else if (this.uiMode == UI_MODE.CONFIRM_SELECTION) {
                    this.log();
                }
            })

            control.onEvent(DAL.DEVICE_BUTTON_EVT_DOWN, DAL.DEVICE_ID_BUTTON_B, () => {
                this.dynamicSensorSelectionTriggered = false;
                this.sensorHasBeenSelected = false

                if (this.uiMode == UI_MODE.CONFIRM_SELECTION)
                    this.uiMode = UI_MODE.SENSOR_SELECTION
                else if (this.uiMode == UI_MODE.SENSOR_SELECTION)
                    this.uiSensorSelectState = (this.uiSensorSelectState + 1) % SENSOR_SELECTION_SIZE
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
                {sensor: new MagnetXSensor(),        uiState: UI_SENSOR_SELECT_STATE.MAGNET,       threshold: 0.75}
            ];

            // Don't trigger the same sensor selection twice in a row:
            let ignore: boolean[] = dynamicInfo.map(_ => false);
            control.inBackground(() => {
                while (!this.sensorHasBeenSelected) {
                    if (this.uiMode == UI_MODE.SENSOR_SELECTION) {
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
                    }
                    basic.pause(100)
                }
                return;
            })
        }

        private handleDynamicSensorSelection(waitTime: number) {
            this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(waitTime);
        }

        private showSensorIcon() {
            this.dynamicSensorSelectionTriggered = false;

            while (true) {
                switch (this.uiSensorSelectState) {
                    case UI_SENSOR_SELECT_STATE.ACCELERATION: {
                        if (this.uiMode == UI_MODE.CONFIRM_SELECTION) {
                            basic.clearScreen()
                            basic.showString("Accel?");
                            basic.pause(25)
                        }

                        else if (this.uiMode == UI_MODE.SENSOR_SELECTION) {
                            // basic.showLeds() requires a literal ''; thus the following is unloopable: 

                            basic.showLeds(`
                                # # # . .
                                # # . . .
                                # . # . .
                                . . . # .
                                . . . . .
                            `);
                            this.handleDynamicSensorSelection(SHOW_EACH_SENSOR_FOR_MS / 3);

                            basic.showLeds(`
                                . . # . .
                                . . # . .
                                # # # # #
                                . # # # .
                                . . # . .
                            `);
                            this.handleDynamicSensorSelection(SHOW_EACH_SENSOR_FOR_MS / 3);

                            basic.showLeds(`
                                . . # . .
                                . . # # .
                                # # # # #
                                . . # # .
                                . . # . .
                            `);
                            this.handleDynamicSensorSelection(SHOW_EACH_SENSOR_FOR_MS / 3);
                        }
                        break;
                    }
                        
                    case UI_SENSOR_SELECT_STATE.TEMPERATURE: {
                        if (this.uiMode == UI_MODE.CONFIRM_SELECTION) {
                            basic.clearScreen()
                            basic.showString("Temp?");
                            basic.pause(25)
                        }

                        else if (this.uiMode == UI_MODE.SENSOR_SELECTION) {
                            basic.showLeds(`
                                # . . . .
                                . . # # .
                                . # . . .
                                . # . . .
                                . . # # .
                            `)
                            this.handleDynamicSensorSelection(SHOW_EACH_SENSOR_FOR_MS);
                        }
                        break;
                    }

                    case UI_SENSOR_SELECT_STATE.LIGHT: {
                        if (this.uiMode == UI_MODE.CONFIRM_SELECTION) {
                            basic.clearScreen()
                            basic.showString("Light?");
                            basic.pause(25)
                        }

                        else if (this.uiMode == UI_MODE.SENSOR_SELECTION) {
                            basic.showLeds(`
                                . . . . .
                                . . # . .
                                . . # . .
                                . . . . .
                                . . # . .
                            `)
                            this.handleDynamicSensorSelection(SHOW_EACH_SENSOR_FOR_MS / 2);
                            
                            basic.showLeds(`
                                . . # . .
                                . # # # .
                                . # # # .
                                . . . . .
                                . . # . .
                            `)
                            this.handleDynamicSensorSelection(SHOW_EACH_SENSOR_FOR_MS / 2);
                        }
                        break;
                    }

                    case UI_SENSOR_SELECT_STATE.MAGNET: {
                        if (this.uiMode == UI_MODE.CONFIRM_SELECTION) {
                            basic.clearScreen()
                            basic.showString("Magnet?");
                            basic.pause(25)
                        }

                        else if (this.uiMode == UI_MODE.SENSOR_SELECTION) {
                            basic.showLeds(`
                                . # # # .
                                # # # # #
                                # # . # #
                                . . . . .
                                # # . # #
                            `)
                            this.handleDynamicSensorSelection(SHOW_EACH_SENSOR_FOR_MS);
                        }
                        break;
                    }

                    case UI_SENSOR_SELECT_STATE.RADIO: {
                        if (this.uiMode == UI_MODE.CONFIRM_SELECTION) {
                            basic.clearScreen()
                            basic.showString("Radio?");
                            basic.pause(25)
                        }

                        else if (this.uiMode == UI_MODE.SENSOR_SELECTION) {
                            basic.showLeds(`
                                . . . . .
                                . . . . .
                                . # # # .
                                # . . . #
                                . . # . . 
                            `)
                            this.handleDynamicSensorSelection(SHOW_EACH_SENSOR_FOR_MS / 2);
                            
                            basic.showLeds(`
                                . # # # .
                                # . . . #
                                . . # . .
                                . # # # .
                                . . # . .
                            `)
                            this.handleDynamicSensorSelection(SHOW_EACH_SENSOR_FOR_MS / 2);
                        }
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

            basic.showString(sensors[0].getName())
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