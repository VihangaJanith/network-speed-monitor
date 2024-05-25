# Network Speed Monitor

A Node.js module for monitoring network speed.

## Installation

```bash
npm install network-speed-monitor
```

## Usage

```bash
const NetworkSpeedMonitor = require("network-speed-monitor");

// Create a new instance with refresh interval (in ms) and unit ("KB" or "MB" or "GB")
const monitor = new NetworkSpeedMonitor(1000, "KB");

// Start monitoring and receive speed stats in the callback
monitor.startMonitoring((stats) => {
  console.log(
    `Upload Speed: ${stats.uploadSpeed}, Download Speed: ${stats.downloadSpeed}`
  );
});

// To stop monitoring
// monitor.stopMonitoring();
```

## API

`new NetworkSpeedMonitor(interval: number, unit: string)` Creates a new instance of `NetworkSpeedMonitor`.

- `interval`: Interval in milliseconds to calculate network speed.
- `unit`: Unit of measurement for network speed. Available options:"KB", "MB", "GB".
- `startMonitoring()`: Starts monitoring the network speed.
- `stopMonitoring()`: Stops monitoring the network speed.
