const os = require("os");
const si = require("systeminformation");

class NetworkSpeedMonitor {
  constructor(updateInterval = 1000, unit = "KB") {
    this.updateInterval = updateInterval;
    this.unit = unit;
    this.activeInterface = this.getActiveNetworkInterface();
    this.intervalId = null;
  }

  getActiveNetworkInterface() {
    const networkInterfaces = os.networkInterfaces();
    for (const key in networkInterfaces) {
      const iface = networkInterfaces[key].find(
        (iface) => !iface.internal && iface.family === "IPv4"
      );
      if (iface) {
        return iface;
      }
    }
    return null;
  }

  async getNetworkStats() {
    if (!this.activeInterface) {
      throw new Error("No active network interface found.");
    }
    try {
      const netStats = await si.networkStats(this.activeInterface.iface);
      const uploadSpeedBytesPerSec = netStats[0].tx_sec;
      const downloadSpeedBytesPerSec = netStats[0].rx_sec;

      let uploadSpeed, downloadSpeed;

      switch (this.unit) {
        case "MB":
          uploadSpeed = (uploadSpeedBytesPerSec / (1024 * 1024)).toFixed(4);
          downloadSpeed = (downloadSpeedBytesPerSec / (1024 * 1024)).toFixed(4);
          break;
        case "GB":
          uploadSpeed = (uploadSpeedBytesPerSec / (1024 * 1024 * 1024)).toFixed(
            4
          );
          downloadSpeed = (
            downloadSpeedBytesPerSec /
            (1024 * 1024 * 1024)
          ).toFixed(4);
          break;
        case "KB":
        default:
          uploadSpeed = (uploadSpeedBytesPerSec / 1024).toFixed(4);
          downloadSpeed = (downloadSpeedBytesPerSec / 1024).toFixed(4);
          break;
      }

      return { uploadSpeed, downloadSpeed };
    } catch (error) {
      throw new Error("Error fetching bandwidth usage:", error);
    }
  }

  startMonitoring(callback) {
    if (!this.activeInterface) {
      throw new Error("No active network interface found.");
    }
    this.intervalId = setInterval(async () => {
      try {
        const stats = await this.getNetworkStats();
        callback(stats);
      } catch (error) {
        console.error(error);
      }
    }, this.updateInterval);
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

module.exports = NetworkSpeedMonitor;
