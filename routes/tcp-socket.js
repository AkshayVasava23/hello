const net = require('net');

//=====================================================================================================

class TCPSocket {
  constructor(host, port, timeout=120000) {
    this.host = host;
    this.port = port;
    this.timeout = timeout;
    this.socket = new net.Socket();
  }

  connect() {
    this.socket.connect(this.port, this.host, () => {
      console.log(`Connected to ${this.host}:${this.port}`);
      this.socket.setTimeout(this.timeout);
    });
  }

  send(data) {
    this.socket.write(data);
  }

  receive(callback) {
    this.socket.on('data', (data) => {
      callback(data.toString());
    });
  }

  onTimeout(callback) {
    this.socket.on('timeout', () => {
      callback();
    });
  }

  error(callback) {
    this.socket.on('error', (error) => {
      callback(error);
    });
  }

  close() {
    this.socket.end();
  }
}

//=====================================================================================================

module.exports = TCPSocket;