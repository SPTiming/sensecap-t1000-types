# SenseCAP T1000 LoRa Tracker Formatter

Simplified decoder and TypeScript types for the SenseCAP T1000 LoRa Tracker with flat, easy-to-use payload structure.

## 📦 What's Inside

This repository contains:

1. **TypeScript Types Package** (`@sptiming/sensecap-t1000-types`) - NPM package with TypeScript definitions
2. **Custom TTN Decoder** - Optimized JavaScript decoder for The Things Network
3. **JSON Schema** - Complete payload structure definition
4. **OpenAPI Spec** - API documentation (Swagger)

## 🎯 Features

- **Flat Structure**: Simple key-value pairs instead of nested arrays
- **Type-Safe**: Full TypeScript support for Firebase/Node.js projects
- **TTN Compatible**: Decoder fits within 4KB size limit
- **Complete Coverage**: Supports all 11 T1000 frame types

## 🚀 Quick Start

### For TypeScript/Firebase Projects

Install the types package:

```bash
npm install @sptiming/sensecap-t1000-types
```

Use in your code:

```typescript
import type { DecodedPayload } from '@sptiming/sensecap-t1000-types';

function processTrackerData(payload: DecodedPayload) {
  console.log(`Frame: ${payload.frameType}`);
  console.log(`Battery: ${payload.battery}%`);
  
  if (payload.location) {
    console.log(`Location: ${payload.location.latitude}, ${payload.location.longitude}`);
  }
}
```

### For The Things Network

1. Copy the decoder: `src/custom/SenseCAP_T1000_SPTiming_Decoder.js`
2. Paste into TTN Console → Applications → Your App → Payload Formatters → Uplink
3. Save

## 📊 Payload Structure

### Simple Flat Format

Instead of complex nested arrays, you get clean objects:

```javascript
{
  // Always present
  "valid": true,
  "err": 0,
  "payload": "0900000000698252420070939f02c163b846",
  "frameType": "0x09",
  
  // Optional fields (based on frame type)
  "timestamp": 1770148418000,
  "motionId": 0,
  "battery": 70,
  "location": {
    "latitude": 46.228408,
    "longitude": 7.377823
  },
  "temperature": 25.4,
  "light": 0,
  "events": [
    { "id": 4, "name": "Shock event" }
  ]
}
```

## 🗂️ Project Structure

```
sensecap_lora_formatter/
├── package.json                 # NPM package config
├── tsconfig.json                # TypeScript config
├── README.md                    # This file
│
├── src/
│   ├── specs/
│   │   ├── decoded-payload.schema.json      # JSON Schema
│   │   └── decoded-payload-schema.yaml      # OpenAPI/Swagger
│   │
│   ├── types/
│   │   └── index.ts             # Generated TypeScript types
│   │
│   ├── custom/
│   │   └── SenseCAP_T1000_SPTiming_Decoder.js  # TTN decoder (NOT in npm package)
│   │
│   └── original/
│       └── SenseCAP_T1000_TTN_Decoder.js       # Original Seeed Studio decoder
│
├── samples/
│   ├── decoded-uplink.json      # Example decoded message
│   └── SenaeCAP_T1000_raw-messages.csv
│
└── doc/
    └── Payload.md               # Complete payload documentation
```

## 🔧 Development

### Generate TypeScript Types

```bash
npm install
npm run gen:types
```

This generates `src/types/index.ts` from the JSON Schema.

### Build for Publishing

```bash
npm run build
```

Compiles TypeScript and creates `dist/` folder with declaration files.

### Publish to NPM

```bash
npm publish
```

Automatically runs `gen:types` and `build` before publishing.

## 📝 Supported Frame Types

| Frame ID | Description |
|----------|-------------|
| 0x01 | Device Status - Event Mode |
| 0x02 | Device Status - Periodic Mode |
| 0x05 | Heartbeat |
| 0x06 | GNSS Location + Sensors |
| 0x07 | WiFi Location + Sensors |
| 0x08 | BLE Location + Sensors |
| 0x09 | GNSS Location Only |
| 0x0A | WiFi Location Only |
| 0x0B | BLE Location Only |
| 0x0D | Error |
| 0x11 | Positioning Status + Sensors |

## 🎨 Example Use Cases

### Firebase Cloud Function

```typescript
import * as functions from 'firebase-functions';
import type { DecodedPayload } from '@sptiming/sensecap-t1000-types';

export const processTrackerData = functions.https.onRequest((req, res) => {
  const payload = req.body as DecodedPayload;
  
  if (!payload.valid) {
    return res.status(400).json({ error: payload.errMessage });
  }

  // TypeScript knows all available fields
  const data = {
    timestamp: payload.timestamp,
    battery: payload.battery,
    position: payload.location
  };
  
  res.json(data);
});
```

### Express API

```typescript
import express from 'express';
import type { DecodedPayload } from '@sptiming/sensecap-t1000-types';

const app = express();

app.post('/tracker/uplink', (req, res) => {
  const payload = req.body as DecodedPayload;
  
  if (payload.frameType === '0x09' && payload.location) {
    // Handle GNSS location
    saveLocation(payload.location);
  }
  
  res.json({ received: true });
});
```

## 📚 Documentation

- **JSON Schema**: `src/specs/decoded-payload.schema.json`
- **OpenAPI Spec**: `src/specs/decoded-payload-schema.yaml`
- **Payload Format**: `doc/Payload.md`

View the OpenAPI spec online:
- [Swagger Editor](https://editor.swagger.io/)
- Paste content from `decoded-payload-schema.yaml`

## 🔍 Schema Validation

You can validate payloads against the JSON Schema:

```typescript
import Ajv from 'ajv';
import schema from '@sptiming/sensecap-t1000-types/decoded-payload.schema.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

const isValid = validate(payload);
if (!isValid) {
  console.error(validate.errors);
}
```

## 📦 What's Published to NPM

The `@sptiming/sensecap-t1000-types` package includes:
- TypeScript type definitions (`dist/index.d.ts`)
- JSON Schema (`src/specs/decoded-payload.schema.json`)
- Compiled JavaScript (`dist/index.js`)

**Not included**: The TTN decoder (stays in GitHub only)

## 🛠️ Size Optimization

The TTN decoder is optimized for size:
- ✅ No comments
- ✅ Readable variable names
- ✅ Efficient helper functions
- ✅ ~11KB source → ~3-4KB when TTN compresses
- ✅ Fits within 4KB TTN limit

## 🤝 Contributing

This is a custom formatter for SPTiming projects. For issues or suggestions, please open a GitHub issue.

## 📄 License

MIT

## 🔗 Links

- [SenseCAP T1000 Official Docs](https://www.seeedstudio.com/sensecap-t1000-tracker)
- [The Things Network](https://www.thethingsnetwork.org/)
- [SPTiming on NPM](https://www.npmjs.com/~sptiming)

## 🙏 Credits

Based on the original SenseCAP T1000 decoder by Seeed Studio, simplified and optimized for SPTiming use cases.
