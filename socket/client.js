var ByteBuffer = require("bytebuffer");
var net = require("net");

const APP_SERVER_PORT = 5000;
/* Timeout in ms to attempt to reconnect to app server */
const PKT_HEADER_SIZE = 4;
const PKT_HEADER_LEN_FIELD = 0;
const PKT_HEADER_CMDID_FIELD = 3;
var Smsgs_dataFields = Object.freeze({
  tempSensor: 0x0001,
  lightSensor: 0x0002,
  humiditySensor: 0x0004,
  msgStats: 0x0008,
  configSettings: 0x0010,
});
var smgsCmdIds = Object.freeze({
  CONFIG_REQ: 1,
  CONFIG_RSP: 2,
  TRACKING_REQ: 3,
  TRACKING_RSP: 4,
  SENSOR_DATA: 5,
  TOGGLE_REQ: 6,
  TOGGLE_RSP: 7,
});

/* address mode */
const ADDTYPE_SHORT = 2;
const ADDTYPE_EXT = 3;

function AppClient() {
  var client = net.Socket();
  var connectedDeviceList = [];
  this.sensordata = {
    id: "0x00",
    rssi: "rssi_val",
    temp: "temp_val",
    hum: "hum_val",
  };
  self = this;
  client.connect(APP_SERVER_PORT, "192.168.0.128", function () {
    console.log("gw connect");
  });

  client.on("data", function (data) {
    appC_processIncoming(data);
  });

  function appC_processIncoming(data) {
    var dataIdx = 0;
    while (dataIdx < data.length) {
      var rx_pkt_len =
        data[dataIdx + PKT_HEADER_LEN_FIELD] +
        (data[dataIdx + PKT_HEADER_LEN_FIELD + 1] << 8) +
        PKT_HEADER_SIZE;
      var rx_pkt_buf = new ByteBuffer(rx_pkt_len, ByteBuffer.LITTLE_ENDIAN);
      rx_pkt_buf.append(data.slice(dataIdx, dataIdx + rx_pkt_len), "hex", 0);
      dataIdx = dataIdx + rx_pkt_len;
      var rx_cmd_id = rx_pkt_buf.readUint8(PKT_HEADER_CMDID_FIELD);

      switch (rx_cmd_id) {
        case 9:
          try {
            appC_processDeviceDataRxIndMsg(rx_pkt_buf);
          } catch (ex) {
            console.log(ex);
          }

          break;
      }
    }
  }

  function appC_processDeviceDataRxIndMsg(data) {
    data.mark(PKT_HEADER_SIZE);
    data.reset();
    var deviceIdx = -1;
    var deviceData = {};
    deviceData.srcAddr = {};
    deviceData.srcAddr.addrMode = data.readUint8();
    if (deviceData.srcAddr.addrMode == ADDTYPE_EXT) {
      deviceData.srcAddr.extAddr = data.readUint64();
      var tempExtAddr =
        deviceData.srcAddr.extAddr.high.toString() +
        deviceData.srcAddr.extAddr.low.toString();
      deviceIdx = findDeviceIndexFromAddr(tempExtAddr);
    } else if (deviceData.srcAddr.addrMode == ADDTYPE_SHORT) {
      deviceData.srcAddr.shortAddr = data.readUint16();
      deviceIdx = findDeviceIndexFromAddr(deviceData.srcAddr.shortAddr);
    } else {
      console.log("unknown addr mode: " + deviceData.srcAddr.addrMode);
      return;
    }

    self.sensordata.rssi = data.readInt8();

    /* Sensor data msg received */
    if (data.readUint8() == smgsCmdIds.SENSOR_DATA) {
      deviceData.extAddr = data.readUint64();
      deviceData.frameControl = data.readUint16();

      /* Temperature sensor data received */
      if (deviceData.frameControl & Smsgs_dataFields.tempSensor) {
        self.sensordata.temp = data.readUint16() / 10;
        data.readUint16();
      }
      if (deviceData.frameControl & Smsgs_dataFields.lightSensor) {
        data.readUint16();
      }
      if (deviceData.frameControl & Smsgs_dataFields.humiditySensor) {
        self.sensordata.hum = data.readUint16();
      }
    }

    self.sensordata.id =
      deviceData.extAddr.high.toString() + deviceData.extAddr.low.toString();
  }
  function findDeviceIndexFromAddr(srcAddr) {
    /* find the device in the connected device list and update info */
    for (var i = 0; i < connectedDeviceList.length; i++) {
      var inarrayExtAdd =
        connectedDeviceList[i].extAddress.high.toString() +
        connectedDeviceList[i].extAddress.low.toString();
      console.log("Adrress : ", inarrayExtAdd);
      if (
        connectedDeviceList[i].shortAddress == srcAddr ||
        inarrayExtAdd == srcAddr
      ) {
        console.log("already exists");
        return i;
      }
    }
    return -1;
  }
}

module.exports = AppClient;
