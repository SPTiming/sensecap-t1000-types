function decodeUplink(input) {
  const bytes = input.bytes;
  const hex = bytes2hex(bytes);
  const frameId = bytes[0];
  
  const result = {
    valid: true,
    err: 0,
    payload: hex,
    frameType: '0x' + frameId.toString(16).padStart(2, '0').toUpperCase()
  };

  try {
    switch (frameId) {
      case 0x01:
        return decode0x01(bytes, result);
      case 0x02:
        return decode0x02(bytes, result);
      case 0x05:
        return decode0x05(bytes, result);
      case 0x06:
        return decode0x06(bytes, result);
      case 0x07:
        return decode0x07(bytes, result);
      case 0x08:
        return decode0x08(bytes, result);
      case 0x09:
        return decode0x09(bytes, result);
      case 0x0A:
        return decode0x0A(bytes, result);
      case 0x0B:
        return decode0x0B(bytes, result);
      case 0x0D:
        return decode0x0D(bytes, result);
      case 0x11:
        return decode0x11(bytes, result);
      default:
        result.valid = false;
        result.err = 1;
        result.errMessage = 'Unknown frame type';
        return { data: result };
    }
  } catch (e) {
    result.valid = false;
    result.err = 2;
    result.errMessage = e.message;
    return { data: result };
  }
}

function decode0x01(bytes, result) {
  result.battery = bytes[1];
  result.firmwareVersion = `${bytes[2]}.${bytes[3]}`;
  result.hardwareVersion = `${bytes[4]}.${bytes[5]}`;
  result.workMode = bytes[6];
  result.positioningStrategy = bytes[7];
  result.heartbeatInterval = getUint16(bytes, 8);
  result.periodicInterval = getUint16(bytes, 10);
  result.eventInterval = getUint16(bytes, 12);
  result.sensorEnable = bytes[14];
  result.sosMode = bytes[15];
  result.config = {
    motion: {
      enable: bytes[16],
      threshold: getUint16(bytes, 17),
      startInterval: getUint16(bytes, 19)
    },
    static: {
      enable: bytes[21],
      timeout: getUint16(bytes, 22)
    },
    shock: {
      enable: bytes[24],
      threshold: getUint16(bytes, 25)
    },
    temperature: {
      enable: bytes[27],
      eventInterval: getUint16(bytes, 28),
      sampleInterval: getUint16(bytes, 30),
      thresholdMax: getInt16(bytes, 32) / 10,
      thresholdMin: getInt16(bytes, 34) / 10,
      warningType: bytes[36]
    },
    light: {
      enable: bytes[37],
      eventInterval: getUint16(bytes, 38),
      sampleInterval: getUint16(bytes, 40),
      thresholdMax: getUint16(bytes, 42),
      thresholdMin: getUint16(bytes, 44),
      warningType: bytes[46]
    }
  };
  return { data: result };
}

function decode0x02(bytes, result) {
  result.battery = bytes[1];
  result.firmwareVersion = `${bytes[2]}.${bytes[3]}`;
  result.hardwareVersion = `${bytes[4]}.${bytes[5]}`;
  result.workMode = bytes[6];
  result.positioningStrategy = bytes[7];
  result.heartbeatInterval = getUint16(bytes, 8);
  result.periodicInterval = getUint16(bytes, 10);
  result.eventInterval = getUint16(bytes, 12);
  result.sensorEnable = bytes[14];
  result.sosMode = bytes[15];
  return { data: result };
}

function decode0x05(bytes, result) {
  result.battery = bytes[1];
  result.workMode = bytes[2];
  result.positioningStrategy = bytes[3];
  result.sosMode = bytes[4];
  return { data: result };
}

function decode0x06(bytes, result) {
  const events = getEventStatus(bytes, 1);
  result.motionId = bytes[4];
  result.timestamp = getUint32(bytes, 5) * 1000;
  result.location = {
    longitude: getInt32(bytes, 9) / 1000000,
    latitude: getInt32(bytes, 13) / 1000000
  };
  const temp = getInt16(bytes, 17);
  if (temp !== -32768) result.temperature = temp / 10;
  const light = getUint16(bytes, 19);
  if (light !== 65535) result.light = light;
  result.battery = bytes[21];
  if (events.length > 0) result.events = events;
  return { data: result };
}

function decode0x07(bytes, result) {
  const events = getEventStatus(bytes, 1);
  result.motionId = bytes[4];
  result.timestamp = getUint32(bytes, 5) * 1000;
  result.wifiScan = getMacList(bytes, 9, 28);
  const temp = getInt16(bytes, 37);
  if (temp !== -32768) result.temperature = temp / 10;
  const light = getUint16(bytes, 39);
  if (light !== 65535) result.light = light;
  result.battery = bytes[41];
  if (events.length > 0) result.events = events;
  return { data: result };
}

function decode0x08(bytes, result) {
  const events = getEventStatus(bytes, 1);
  result.motionId = bytes[4];
  result.timestamp = getUint32(bytes, 5) * 1000;
  result.bleScan = getMacList(bytes, 9, 21);
  const temp = getInt16(bytes, 30);
  if (temp !== -32768) result.temperature = temp / 10;
  const light = getUint16(bytes, 32);
  if (light !== 65535) result.light = light;
  result.battery = bytes[34];
  if (events.length > 0) result.events = events;
  return { data: result };
}

function decode0x09(bytes, result) {
  const events = getEventStatus(bytes, 1);
  result.motionId = bytes[4];
  result.timestamp = getUint32(bytes, 5) * 1000;
  result.location = {
    longitude: getInt32(bytes, 9) / 1000000,
    latitude: getInt32(bytes, 13) / 1000000
  };
  result.battery = bytes[17];
  if (events.length > 0) result.events = events;
  return { data: result };
}

function decode0x0A(bytes, result) {
  const events = getEventStatus(bytes, 1);
  result.motionId = bytes[4];
  result.timestamp = getUint32(bytes, 5) * 1000;
  result.wifiScan = getMacList(bytes, 9, 28);
  result.battery = bytes[37];
  if (events.length > 0) result.events = events;
  return { data: result };
}

function decode0x0B(bytes, result) {
  const events = getEventStatus(bytes, 1);
  result.motionId = bytes[4];
  result.timestamp = getUint32(bytes, 5) * 1000;
  result.bleScan = getMacList(bytes, 9, 21);
  result.battery = bytes[30];
  if (events.length > 0) result.events = events;
  return { data: result };
}

function decode0x0D(bytes, result) {
  const code = getUint32(bytes, 1);
  const messages = {
    1: 'FAILED TO OBTAIN THE UTC TIMESTAMP',
    2: 'ALMANAC TOO OLD',
    3: 'DOPPLER ERROR'
  };
  result.error = {
    code: code,
    message: messages[code] || 'UNKNOWN ERROR'
  };
  return { data: result };
}

function decode0x11(bytes, result) {
  const statusId = bytes[1];
  const events = getEventStatus(bytes, 2);
  result.timestamp = getUint32(bytes, 5) * 1000;
  result.positioningStatus = {
    id: statusId,
    message: getPositioningStatusMessage(statusId)
  };
  const temp = getInt16(bytes, 9);
  if (temp !== -32768) result.temperature = temp / 10;
  const light = getUint16(bytes, 11);
  if (light !== 65535) result.light = light;
  result.battery = bytes[13];
  if (events.length > 0) result.events = events;
  return { data: result };
}

function bytes2hex(bytes) {
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUint16(bytes, offset) {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function getUint32(bytes, offset) {
  return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | 
          (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
}

function getInt16(bytes, offset) {
  const val = (bytes[offset] << 8) | bytes[offset + 1];
  return val > 32767 ? val - 65536 : val;
}

function getInt32(bytes, offset) {
  const val = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | 
              (bytes[offset + 2] << 8) | bytes[offset + 3];
  return val;
}

function getEventStatus(bytes, offset) {
  const eventBits = (bytes[offset] << 16) | (bytes[offset + 1] << 8) | bytes[offset + 2];
  const events = [];
  const eventNames = [
    'Start moving event',
    'End movement event',
    'Motionless event',
    'Shock event',
    'Temperature event',
    'Light event',
    'SOS event',
    'Press once event'
  ];
  for (let i = 0; i < 8; i++) {
    if (eventBits & (1 << i)) {
      events.push({ id: i + 1, name: eventNames[i] });
    }
  }
  return events;
}

function getMacList(bytes, offset, length) {
  const macs = [];
  for (let i = offset; i < offset + length; i += 7) {
    const mac = bytes.slice(i, i + 6);
    if (mac.every(b => b === 0xFF)) continue;
    const rssi = bytes[i + 6] > 127 ? bytes[i + 6] - 256 : bytes[i + 6];
    macs.push({
      mac: mac.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':'),
      rssi: rssi
    });
  }
  return macs;
}

function getPositioningStatusMessage(id) {
  const messages = {
    0: 'locate successful',
    1: 'The GNSS scan timed out',
    2: 'The Wi-Fi scan timed out',
    3: 'The Wi-Fi + GNSS scan timed out',
    4: 'The GNSS + Wi-Fi scan timed out',
    5: 'The Bluetooth scan timed out',
    6: 'The Bluetooth + Wi-Fi scan timed out',
    7: 'The Bluetooth + GNSS scan timed out',
    8: 'The Bluetooth + Wi-Fi + GNSS scan timed out',
    9: 'Location Server failed to parse the GNSS location',
    10: 'Location Server failed to parse the Wi-Fi location',
    11: 'Location Server failed to parse the Bluetooth location',
    12: 'Failed to parse location due to the poor accuracy',
    13: 'Time synchronization failed',
    14: 'Failed due to the old Almanac'
  };
  return messages[id] || 'Unknown status';
}
