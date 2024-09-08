namespace microcode {
    const enum UI_DISPLAY_STATE {
        ACCELERATION,
        TEMPERATURE,
        LIGHT,
        MAGNET,
        RADIO
    }

    const SENSOR_SELECTION_SIZE = 5;

    const SHOW_EACH_SENSOR_FOR_MS: number = 1000;

    export class NoArcadeShieldMode {
        private app: App;
        private uiState: UI_DISPLAY_STATE;
        private dynamicSensorSelectionTriggered: boolean;
        private sensorHasBeenSelected: boolean;

        constructor(app: App) {
            this.app = app;
            this.uiState = UI_DISPLAY_STATE.ACCELERATION;
            this.sensorHasBeenSelected = false;

            control.onEvent(DAL.DEVICE_BUTTON_EVT_DOWN, DAL.DEVICE_ID_BUTTON_A, () => {
                this.dynamicSensorSelectionTriggered = false;
                this.sensorHasBeenSelected = false

                this.log();
            })

            control.onEvent(DAL.DEVICE_BUTTON_EVT_DOWN, DAL.DEVICE_ID_BUTTON_B, () => {
                basic.showLeds(`
                    . . . . .
                    . # . # .
                    . . . . .
                    . # . # .
                    . # # # .    
                `)
                this.uiState = (this.uiState + 1) % SENSOR_SELECTION_SIZE

                this.dynamicSensorSelectionTriggered = false;
                this.sensorHasBeenSelected = false
            })

            this.dynamicSensorSelectionLoop();
            this.showSensorIcon();
        }

        private dynamicSensorSelectionLoop() {
            const dynamicInfo = [
                {sensor: new AccelerometerXSensor(), uiState: UI_DISPLAY_STATE.ACCELERATION, threshold: 0.25}, 
                {sensor: new AccelerometerYSensor(), uiState: UI_DISPLAY_STATE.ACCELERATION, threshold: 0.25}, 
                {sensor: new AccelerometerZSensor(), uiState: UI_DISPLAY_STATE.ACCELERATION, threshold: 0.25},
                {sensor: new LightSensor(),          uiState: UI_DISPLAY_STATE.LIGHT,        threshold: 0.75},
                {sensor: new MagnetXSensor(),        uiState: UI_DISPLAY_STATE.MAGNET,       threshold: 0.75}
            ];

            // Don't trigger the same sensor selection twice in a row:
            let ignore: boolean[] = dynamicInfo.map(_ => false);
            control.inBackground(() => {
                while (!this.sensorHasBeenSelected) {
                    dynamicInfo.forEach((info, idx) => {
                        if (!ignore[idx] && info.sensor.getNormalisedReading() > info.threshold) {
                            this.uiState = info.uiState;
                            this.dynamicSensorSelectionTriggered = true;

                            ignore = dynamicInfo.map(_ => false);
                            ignore[idx] = true;
                            basic.pause(1000)
                            this.dynamicSensorSelectionTriggered = false;
                        }
                    })
                    basic.pause(100)
                }
            })
        }

        private showSensorIcon() {
            this.dynamicSensorSelectionTriggered = false;

            switch (this.uiState) {
                case UI_DISPLAY_STATE.ACCELERATION:
                    while (true) {
                        basic.showLeds(`
                            # # # . .
                            # # . . .
                            # . # . .
                            . . . # .
                            . . . . .
                        `);

                        this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(SHOW_EACH_SENSOR_FOR_MS / 3);

                        basic.showLeds(`
                            . . # . .
                            . . # . .
                            # # # # #
                            . # # # .
                            . . # . .
                        `);
                        this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(SHOW_EACH_SENSOR_FOR_MS / 3);

                        basic.showLeds(`
                            . . # . .
                            . . # # .
                            # # # # #
                            . . # # .
                            . . # . .
                        `);
                        this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(SHOW_EACH_SENSOR_FOR_MS / 3);
                    }

                case UI_DISPLAY_STATE.TEMPERATURE:
                    while (true) {
                        basic.showLeds(`
                            # . . . .
                            . . # # .
                            . # . . .
                            . # . . .
                            . . # # .
                        `)
                        this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(SHOW_EACH_SENSOR_FOR_MS);
                    }

                case UI_DISPLAY_STATE.LIGHT:
                    while (true) {
                        basic.showLeds(`
                            . . . . .
                            . . # . .
                            . . # . .
                            . . . . .
                            . . # . .
                        `)
                        this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(SHOW_EACH_SENSOR_FOR_MS / 2);
                        
                        basic.showLeds(`
                            . . # . .
                            . # # # .
                            . # # # .
                            . . . . .
                            . . # . .
                        `)
                        this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(SHOW_EACH_SENSOR_FOR_MS / 2);
                    }

                case UI_DISPLAY_STATE.MAGNET:
                    while (true) {
                        basic.showLeds(`
                            . # # # .
                            # # # # #
                            # # . # #
                            . . . . .
                            # # . # #
                        `)
                        this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(SHOW_EACH_SENSOR_FOR_MS);
                    }

                case UI_DISPLAY_STATE.RADIO:
                    while (true) {
                        basic.showLeds(`
                            . . . . .
                            . . . . .
                            . # # # .
                            # . . . #
                            . . # . . 
                        `)
                        this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(SHOW_EACH_SENSOR_FOR_MS / 2);
                        
                        basic.showLeds(`
                            . # # # .
                            # . . . #
                            . . # . .
                            . # # # .
                            . . # . .
                        `)
                        this.dynamicSensorSelectionTriggered ? this.showSensorIcon() : basic.pause(SHOW_EACH_SENSOR_FOR_MS / 2);
                    }                    
                default:
                    break;
            }
        }

        private log() {
            const sensors = this.uiSelectionToSensors();

            basic.showString(sensors[0].getName())
        }

        private uiSelectionToSensors(): Sensor[] {
            switch (this.uiState) {
                case UI_DISPLAY_STATE.ACCELERATION:
                    return [new AccelerometerXSensor(), new AccelerometerYSensor(), new AccelerometerZSensor()]

                case UI_DISPLAY_STATE.TEMPERATURE:
                    return [new TemperatureSensor()]

                case UI_DISPLAY_STATE.LIGHT:
                    return [new LightSensor()]

                case UI_DISPLAY_STATE.MAGNET:
                    return [new MagnetXSensor()]

                case UI_DISPLAY_STATE.RADIO:
                    // new DistributedLoggingProtocol(this.app, false);
                    return []
            
                default:
                    return []
            }
        }
    }
}