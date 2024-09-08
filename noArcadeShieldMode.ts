namespace microcode {
    const enum SENSOR_SELECTION {
        ACCELERATION,
        TEMPERATURE,
        LIGHT
    }

    const SHOW_EACH_SENSOR_FOR_MS: number = 1000;

    export class NoArcadeShieldMode {
        private app: App;
        private currentUISensor: SENSOR_SELECTION;
        private loopThroughSensorSelection: boolean;

        constructor(app: App) {
            this.app = app;
            this.currentUISensor = SENSOR_SELECTION.ACCELERATION;
            this.loopThroughSensorSelection = true

            control.onEvent(DAL.DEVICE_BUTTON_EVT_DOWN, DAL.DEVICE_ID_BUTTON_A, () => {
                basic.showLeds(`
                    . # . # .
                    . # . # .
                    . . . . .
                    # . . . #
                    . # # # .
                `)
                
                this.loopThroughSensorSelection = false
                this.log();
            })

            this.showSensorSelection();
            // new DistributedLoggingProtocol(app, false);
        }


        private showSensorSelection() {
            control.inBackground(() => {

            })

            control.inBackground(() => {
                while (this.loopThroughSensorSelection) {
                    switch (this.currentUISensor) {
                        case SENSOR_SELECTION.ACCELERATION:
                            basic.showLeds(`
                                # # # . .
                                # # . . .
                                # . # . .
                                . . . # .
                                . . . . .
                            `)
                            basic.pause(SHOW_EACH_SENSOR_FOR_MS / 3)
                            
                            basic.showLeds(`
                                . . # . .
                                . . # . .
                                # # # # #
                                . # # # .
                                . . # . .
                            `)
                            basic.pause(SHOW_EACH_SENSOR_FOR_MS / 3)

                            basic.showLeds(`
                                . . # . .
                                . . # # .
                                # # # # #
                                . . # # .
                                . . # . .
                            `)
                            basic.pause(SHOW_EACH_SENSOR_FOR_MS / 3)

                            this.currentUISensor = SENSOR_SELECTION.TEMPERATURE
                            break;

                        case SENSOR_SELECTION.TEMPERATURE:
                            basic.showLeds(`
                                # . . . .
                                . . # # .
                                . # . . .
                                . # . . .
                                . . # # .
                            `)
                            basic.pause(SHOW_EACH_SENSOR_FOR_MS)

                            this.currentUISensor = SENSOR_SELECTION.LIGHT
                            break;

                        case SENSOR_SELECTION.LIGHT:
                            basic.showLeds(`
                                . . . . .
                                . . # . .
                                . . # . .
                                . . . . .
                                . . # . .
                                `)
                            basic.pause(SHOW_EACH_SENSOR_FOR_MS / 2)
                            
                            basic.showLeds(`
                                . . # . .
                                . # # # .
                                . # # # .
                                . . . . .
                                . . # . .
                                `)
                            basic.pause(SHOW_EACH_SENSOR_FOR_MS / 2)

                            this.currentUISensor = SENSOR_SELECTION.ACCELERATION
                            break;
                    
                        default:
                            break;
                    }
                } // end of while (this.displaying)
                return;
            })
        }

        private log() {
            const sensors = this.uiSelectionToSensors();

            basic.showString(sensors[0].getName())
        }

        private uiSelectionToSensors(): Sensor[] {
            switch (this.currentUISensor) {
                case SENSOR_SELECTION.ACCELERATION:
                    return [new AccelerometerXSensor(), new AccelerometerYSensor(), new AccelerometerZSensor()]

                case SENSOR_SELECTION.TEMPERATURE:
                    return [new TemperatureSensor()]

                case SENSOR_SELECTION.LIGHT:
                    return [new LightSensor()]
            
                default:
                    return []
            }
        }
    }
}