const SerialPort = require("serialport");

class WeighingScale {
  constructor(portName, baudRate) {
    this.port = new SerialPort(portName, {
      baudRate: baudRate
    });
  }

  // Function to send data to the serial port
  sendData(data) {
    this.port.write(data, (err) => {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log(`Data sent: ${data}`);
    });
  }

  // Listen for data from the serial port
  listen() {
    this.port.on("data", (data) => {
      console.log(`Data received: ${data}`);
    });
  }

  // Open the serial port
  open() {
    this.port.open((err) => {
      if (err) {
        return console.log("Error opening port: ", err.message);
      }
      console.log(`Serial port ${this.port.path} opened`);

      // Send the 'W' command to the serial port
      this.sendData(Buffer.from([87]));
    });
  }
}

module.exports = WeighingScale;
