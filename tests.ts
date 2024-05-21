namespace microcode {
    export class Test extends Scene {
        private currentTestIndex: number
        private testLog: string[]
        private yScrollOffset: number

        constructor(app: App) {
            super(app, "test")
            this.currentTestIndex = 1;
            this.yScrollOffset = 0
        }

        /* override */ startup() {
            super.startup()
            this.test_1()

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {
                    this.yScrollOffset += 20
                }
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => {
                    this.yScrollOffset = Math.max(0, this.yScrollOffset - 20)
                }
            )

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                () => {
                    this.currentTestIndex += 1
                    this.yScrollOffset = 0

                    switch (this.currentTestIndex) {
                        case 1:
                            this.test_1()
                            break;
                        case 2:
                            this.test_2()
                            break;
                        case 3:
                            this.test_3()
                            break;
                        case 4:
                            this.test_4()
                            break;
                        case 5:
                            this.test_5()
                            break;
                        case 6:
                            this.test_6()
                            break;
                        case 7:
                            this.test_7()
                            break;
                        case 8:
                            this.test_8()
                            break;
                        case 9:
                            this.test_9()
                            break;
                        case 10:
                            this.test_10()
                            break;
                    
                        default:
                            this.testLog = ["All tests complete."]
                            break;
                    }
                }
            )

            this.test_1()
        }

        private test_1() {
            this.testLog = []
            this.testLog.push("Test 1: getNumberOfRows(n)")
            datalogger.deleteLog(datalogger.DeleteType.Full)
            datalogger.includeTimestamp(FlashLogTimeStampFormat.None)

            this.testLog.push("0 -> " +datalogger.getNumberOfRows(0))   // 0

            this.testLog.push("adding columns");
            datalogger.setColumns([
                "Sensor",
                "Time (ms)",
                "Reading",
                "Event"
            ])

            this.testLog.push("0 -> " +datalogger.getNumberOfRows(0))   // 0

            this.testLog.push("Writing 10 elements")
            for (let i = 1; i <= 10; i++) {
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000"),
                    datalogger.createCV("Reading", +i),
                    datalogger.createCV("Event", "N/A")
                )
            }
            
            this.testLog.push("0 -> " +datalogger.getNumberOfRows(0))   // 11
            this.testLog.push("1 -> " +datalogger.getNumberOfRows(1))   // 10
            this.testLog.push("10 -> " +datalogger.getNumberOfRows(10)) // 1

            this.testLog.push("Writing 10 more elements")
            for (let i = 11; i <= 20; i++) {
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000"),
                    datalogger.createCV("Reading", +i),
                    datalogger.createCV("Event", "N/A")
                )
            }

            this.testLog.push("0 -> " +datalogger.getNumberOfRows(0))   // 21
            this.testLog.push("1 -> " +datalogger.getNumberOfRows(1))   // 20
            this.testLog.push("-1 -> " +datalogger.getNumberOfRows(-1)) // 21
        }


        private test_2() {
            this.testLog = []
            this.testLog.push("Test 2: getRows(-4, 10)") // 10 rows

            this.testLog.push("getRows(-4, 10)")
            const rows = datalogger.getRows(-4, 10).split("\n");
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }
        }

        private test_3() {
            this.testLog = []
            this.testLog.push("Test 3: getRows(0, 0)") // ""

            this.testLog.push("getRows(0, 0)")
            const rows = datalogger.getRows(0, 0).split("\n");
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }
        }

        private test_4() {
            this.testLog = []
            this.testLog.push("Test 4: getRows(3, -3)") // ""

            this.testLog.push("getRows(3, -3)")
            const rows = datalogger.getRows(3, -3).split("\n");
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }
        }


        private test_5() {
            this.testLog = []
            this.testLog.push("Test 5: getRows(9, 1)")

            this.testLog.push("getRows(9, 1)")
            const rows = datalogger.getRows(9, 1).split("\n"); // 1 Row which has the reading "9"
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }
        }

        private test_6() {
            this.testLog = []
            this.testLog.push("Test 6: getRows(100, 100)") // Headers + 20 rows

            this.testLog.push("getRows(100, 100)")
            const rows = datalogger.getRows(100, 100).split("\n");
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }
        }

        private test_7() {
            this.testLog = []
            this.testLog.push("Test 7: getRows add data")

            this.testLog.push("clearing log");
            datalogger.deleteLog(datalogger.DeleteType.Full)
            datalogger.includeTimestamp(FlashLogTimeStampFormat.None)

            this.testLog.push("adding columns");
            datalogger.setColumns([
                "Sensor",
                "Time (ms)",
                "Reading",
                "Event"
            ])

            this.testLog.push("getRows(1, 4)")
            let rows = datalogger.getRows(1, 4).split("\n"); // ""
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("getRows(0, 4)")
            rows = datalogger.getRows(0, 4).split("\n"); // Header
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("adding 10 rows")
            for (let i = 1; i <= 10; i++) {
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000"),
                    datalogger.createCV("Reading", +i),
                    datalogger.createCV("Event", "N/A")
                )
            }

            this.testLog.push("getRows(1, 4)")
            rows = datalogger.getRows(1, 4).split("\n"); // Rows with reading 1 -> reading 4
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("adding 10 rows")
            for (let i = 11; i <= 20; i++) {
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000"),
                    datalogger.createCV("Reading", +i),
                    datalogger.createCV("Event", "N/A")
                )
            }

            this.testLog.push("getRows(26, 4)")
            rows = datalogger.getRows(26, 4).split("\n"); // Rows with reading 26 -> reading 30
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }
        }

        private test_8() {
            this.testLog = []
            this.testLog.push("Test 8: getRows() no data")

            this.testLog.push("clearing log");
            datalogger.deleteLog(datalogger.DeleteType.Full)
            datalogger.includeTimestamp(FlashLogTimeStampFormat.None)

            this.testLog.push("getRows(0, 100)")
            let rows = datalogger.getRows(0, 100).split("\n"); // ""
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("adding columns");
            datalogger.setColumns([
                "Sensor",
                "Time (ms)",
                "Reading",
                "Event"
            ])

            this.testLog.push("getRows(0, 100)")
            rows = datalogger.getRows(0, 100).split("\n"); // Headers
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("clearing log");
            datalogger.deleteLog(datalogger.DeleteType.Full)
            datalogger.includeTimestamp(FlashLogTimeStampFormat.None)

            this.testLog.push("adding 5 rows");
            for (let i = 1; i <= 5; i++) {
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000"),
                    datalogger.createCV("Reading", +i),
                    datalogger.createCV("Event", "N/A")
                )
            }

            this.testLog.push("getRows(0, 100)")
            rows = datalogger.getRows(0, 100).split("\n"); // All
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }
        }

        private test_9() {
            this.testLog = []
            this.testLog.push("Test 9: getRows() adding cols")

            this.testLog.push("clearing log");
            datalogger.deleteLog(datalogger.DeleteType.Full)

            this.testLog.push("adding columns");
            datalogger.setColumns([
                "Sensor",
                "Time (ms)"
            ])

            this.testLog.push("getRows(0, 100)")
            let rows = datalogger.getRows(0, 100).split("\n"); // Headers
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("adding 5 rows");
            for (let i = 1; i <= 5; i++) {
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000")
                )
            }

            this.testLog.push("getRows(0, 100)")
            rows = datalogger.getRows(0, 100).split("\n"); // All
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("adding columns");
            datalogger.setColumns([
                "Sensor",
                "Time (ms)",
                "EXTRA"
            ])
            
            this.testLog.push("getRows(0, 100)")
            rows = datalogger.getRows(0, 100).split("\n"); // All
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("adding columns");
            datalogger.setColumns([
                "Sensor",
                "Time (ms)",
                "EXTRA",
                "EXTRA 2"
            ])

            this.testLog.push("adding 5 rows");
            for (let i = 1; i <= 5; i++) {
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000"),
                    datalogger.createCV("EXTRA 2", +i),
                )
            }
            
            this.testLog.push("getRows(0, 100)")
            rows = datalogger.getRows(0, 100).split("\n"); // All
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }
        }

        private test_10() {
            this.testLog = []
            this.testLog.push("Test 10: getRows stress test")

            this.testLog.push("Clearing log")
            datalogger.deleteLog(datalogger.DeleteType.Full)
            datalogger.includeTimestamp(FlashLogTimeStampFormat.None)
            
            this.testLog.push("getRows(0, 100)")
            let rows = datalogger.getRows(0, 100).split("\n"); // ""
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("adding columns");
            datalogger.setColumns([
                "Sensor",
                "Time (ms)",
                "Reading",
                "Event"
            ])

            this.testLog.push("getRows(0, 100)") // Headers
            rows = datalogger.getRows(0, 100).split("\n"); // ""
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("Wait 5 minutes")
            this.update()
            basic.pause(300000)

            for (let i = 1; i <= 4; i++) {
                this.testLog.push("Adding 4 rows")
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000"),
                    datalogger.createCV("Reading", +i),
                    datalogger.createCV("Event", "N/A")
                )
                this.testLog.push("Waiting 2 minutes")
                basic.pause(120000)
            }

            this.testLog.push("getRows(0, 100)") // Headers + 5 rows
            rows = datalogger.getRows(0, 100).split("\n"); // ""
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("Wait 60 minutes")
            this.update()
            basic.pause(3600000)

            this.testLog.push("getRows(0, 100)") // Headers + 5 rows
            rows = datalogger.getRows(0, 100).split("\n"); // ""
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            for (let i = 0; i < 5; i++) {
                this.testLog.push("Wait 1 Second")
                basic.pause(1000)

                this.testLog.push("getRows(0, 100)") // Headers + 5 rows
                rows = datalogger.getRows(0, 100).split("\n"); // ""
                for (let i = 0; i < rows.length; i++) {
                    this.testLog.push(rows[i]);
                }
            }

            this.testLog.push("Clearing log")
            datalogger.deleteLog(datalogger.DeleteType.Full)
            datalogger.includeTimestamp(FlashLogTimeStampFormat.None)

            this.testLog.push("adding columns");
            datalogger.setColumns([
                "Sensor",
                "Time (ms)",
                "Reading",
                "Event"
            ])

            this.testLog.push("getRows(0, 100)") // Headers
            rows = datalogger.getRows(0, 100).split("\n"); // ""
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("0 -> " +datalogger.getNumberOfRows(0))   // 1

            for (let i = 1; i <= 4; i++) {
                this.testLog.push("Adding 4 rows")
                datalogger.log(
                    datalogger.createCV("Sensor", "Accel. X"),
                    datalogger.createCV("Time (ms)", "1000"),
                    datalogger.createCV("Reading", +i),
                    datalogger.createCV("Event", "N/A")
                )
                this.testLog.push("0 -> " +datalogger.getNumberOfRows(0))   // 1 + (i * 4)
                this.testLog.push("Waiting 2 minutes")
                this.update()
                basic.pause(120000)
            }

            this.testLog.push("getRows(-3, 3)") // Headers + 5 rows
            rows = datalogger.getRows(-3, 3).split("\n"); // ""
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
            }

            this.testLog.push("-5 -> " +datalogger.getNumberOfRows(-5))   // 17

            for (let i = 1; i <= 10; i++) {
                this.testLog.push("getRows(0, 100)")
                rows = datalogger.getRows(0, 100).split("\n"); // All
                for (let i = 0; i < rows.length; i++) {
                    this.testLog.push(rows[i]);
                }
            }

            this.testLog.push("Wait 60 minutes")
            this.update()
            basic.pause(3600000)

            this.testLog.push("getRows(0, 100)") // Headers + 5 rows
            rows = datalogger.getRows(0, 100).split("\n"); // ""
            for (let i = 0; i < rows.length; i++) {
                this.testLog.push(rows[i]);
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
            
            for (let i = 0; i < this.testLog.length; i++) {
                screen.printCenter(this.testLog[i], (i * 10) - this.yScrollOffset)
            }
        }
    }
}
