namespace microcode {
    export class Test extends Scene {
        private dataRows: string[][];
        private currentTestIndex: number
        private testResults: string[]

        constructor(app: App) {
            super(app, "test")
            this.dataRows = [];
            this.currentTestIndex = 0;
        }

        /* override */ startup() {
            super.startup()
            this.test_1()

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                () => {
                    this.currentTestIndex += 1

                    switch (this.currentTestIndex) {
                        case 1:
                            this.test_1()
                            break;
                        case 2:
                            this.test_2()
                            break;
                        case 3:
                        
                            break;
                        case 4:
                        
                            break;
                        case 5:
                        
                            break;
                    
                        default:
                            this.testResults = ["All tests complete."]
                            break;
                    }
                }
            )

            this.test_1()
        }

        private test_1() {
            this.testResults = []
            this.testResults.push("Test 1: getNumberOfRows(n)")
            datalogger.deleteLog(datalogger.DeleteType.Full)
            datalogger.includeTimestamp(FlashLogTimeStampFormat.None)

            datalogger.setColumns([
                "Sensor",
                "Time (ms)",
                "Reading",
                "Event"
            ])

            this.testResults.push("Writing 10 elements")
            for (let i = 1; i <= 10; i++) {
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000"),
                    datalogger.createCV("Reading", +i),
                    datalogger.createCV("Event", "N/A")
                )
            }
            
            this.testResults.push("0 -> " +datalogger.getNumberOfRows(0))   // 11
            this.testResults.push("1 -> " +datalogger.getNumberOfRows(1))   // 10
            this.testResults.push("10 -> " +datalogger.getNumberOfRows(10)) // 1

            for (let i = 11; i <= 20; i++) {
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000"),
                    datalogger.createCV("Reading", +i),
                    datalogger.createCV("Event", "N/A")
                )
            }
            this.testResults.push("Writing 10 more elements")


            this.testResults.push("0 -> " +datalogger.getNumberOfRows(0))   // 21
            this.testResults.push("1 -> " +datalogger.getNumberOfRows(1))   // 20
            this.testResults.push("10 -> " +datalogger.getNumberOfRows(10)) // 11
            this.testResults.push("-1 -> " +datalogger.getNumberOfRows(-1)) // 21
        }


        private test_2() {
            const numberOfCols = 4
            
            const tokens = datalogger.getRows(0, 10).split("_");
            for (let i = 0; i < tokens.length - numberOfCols; i += numberOfCols) {
                this.dataRows[i / numberOfCols] = tokens.slice(i, i + numberOfCols);
            }
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )

            
            for (let i = 0; i < this.testResults.length; i++) {
                screen.printCenter(this.testResults[i], (i + 1) * 10)
            }   

            // for (let i = 0; i < this.dataRows.length; i++) {
            //     Screen.fillRect(
            //         Screen.LEFT_EDGE,
            //         Screen.TOP_EDGE,
            //         Screen.WIDTH,
            //         Screen.HEIGHT,
            //         0xc
            //     )

            //     for (let j = 0; j < 4; j++) {
            //         screen.printCenter(this.dataRows[i][j], (j + 1) * 10)
            //     }
            //     basic.pause(1000)
            // }
        }
    }
}
