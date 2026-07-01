

### Required Files (Located in Project Root)

```
├── main.js
├── package.json
├── input_schema.json
├── README.md
├── sdk.js
├── sdk_pb.js
├── sdk_grpc_pb.js

```


| File Name | Description |
| --- | --- |
| **`main.js`** | Script entry file (execution entry point), uniformly named `main` |
| **`package.json`** | Node dependency management file |
| **`input_schema.json`** | UI input form configuration file |
| **`README.md`** | Project documentation |
| **`sdk.js`** | SDK base capabilities |
| **`sdk_pb.js`** | Enhanced data processing module |
| **`sdk_grpc_pb.js`** | Network communication module |

# ⭐ Script Core SDK Files

### 📁 File Description

The following three SDK files are critical. Please place them in the **root directory** of the script:

| **File Name** | **Main Function** |
| --- | --- |
| `sdk.js` | Base functionality module |
| `sdk_pd.js` | Enhanced data processing module |
| `sdk_pd_grpc.js` | Network communication module |

# ⭐Core SDK Files

### 📁 File Description

The following three SDK files are essential. Place them in the **root directory** of your script:

| **File Name** | **Main Function** |
| --- | --- |
| `sdk.js` | Base functionality module |
| `sdk_pd.js` | Enhanced data processing module |
| `sdk_pd_grpc.js` | Network communication module |

These three files form the script’s “toolbox,” providing all the core functions needed to interact with the backend system and run the scraper.
## 🔧 Core Function Usage

### 1. Environment Parameter Retrieval – Get Script Startup Configuration

When the script starts, you can pass configuration parameters from outside (e.g., target website URL, search keywords, etc.). Use the following method to retrieve them:
```js
// Get all input parameters
const inputJson = await coresdk.parameter.getInputJSONObject()
await coresdk.log.debug(`Input parameters: ${JSON.stringify(inputJson)}`)

```

**Use Case:** If you need to scrape different websites for different tasks, you can pass different parameters without modifying the code.

---

### 2. Execution Logs – Record Script Process

During execution, you can record logs at different levels. These logs appear in the backend interface for monitoring and troubleshooting:

```js
// Debug information (most detailed, for troubleshooting)
coresdk.log.debug("Connecting to target website...")

// General information (normal process logging)
coresdk.log.info("Successfully retrieved 10 news items")

// Warning information (non-fatal issues)
coresdk.log.warn("Network connection is slow, may affect scraping speed")

// Error information (execution failures)
coresdk.log.error("Unable to access target website, please check network connection")

```

**Log Level Explanation:**：

- **debug**：Most detailed, suitable for development
- **info**：Normal process logs, recommended for key steps
- **warn**：Warning message, indicates potential issues
- **error**：Error message, indicates an issue that requires attention

---

### 3. Result Submission – Send Scraped Data Back to Backend

After scraping, you need to return the data to the backend in two steps:

### Step 1: Set Table Header (Must be executed first)

Before pushing data, define the table structure like Excel column headers:

```js
// Define table column structure
const headers = [
    {
        label: 'URL',
        key: 'url',
        format: 'text'
    },
    {
        label: 'Status',
        key: 'status',
        format: 'text'
    }
]

// Set table headers
await coresdk.result.setTableHeader(headers)


```

**Field Explanation:**：

- **label**：Column title visible to users (recommended in English for global users)
- **key**：Unique identifier used in code (recommend lowercase with underscores)
- **format**：Data type, supports:
    - `text`
    - `integer`
    - `boolean`
    - `array`
    - `object`

### Step 2: Push Data Row by Row

After setting headers, push the scraped data:

```js
// Simulated business processing result
const result = {
    status: 'success',
    data: [
        {
            title: 'Sample Title',
            content: 'Sample Content'
        }
    ]
}

// Push result data
await coresdk.log.info(`Processing result: ${JSON.stringify(result)}`)
const dataObject = result.data
for (let index = 0; index < dataObject.length; index++) {
    await coresdk.result.pushData(dataObject[index])
}


```

**Important Notes:**

1. Set table headers before pushing data
2. Keys in the data must match the table header keys exactly 
3. Data must be pushed row by row, not all at once
4. Logging after each push is recommended for monitoring progress

---

### ⚠️ Common Issues and Precautions

1. File Location: Ensure the three SDK files are in the same folder as the main script
2. Import Method: Call functions directly via SDK or CoreSDK
3. Key Consistency: Pushed data keys must match header keys exactly
4. Error Handling: Check return results for each SDK call, especially when pushing data

These functions allow your script to integrate seamlessly with the backend system, providing flexible input parameters, transparent execution logs, and structured data submission.

---

# ⭐ Actor Entry File（main.js）

### 💡 Example Code

```js
#!/usr/bin/env node
'use strict'

const coresdk = require('./sdk')

async function run() {
    try {
        // 1. Get input parameters
        const inputJson = await coresdk.parameter.getInputJSONObject()
        await coresdk.log.debug(`Input parameters: ${JSON.stringify(inputJson)}`)

        // 2. Get proxy configuration (retrieve only from environment variables)
        const proxyDomain = process.env.PROXY_DOMAIN
        await coresdk.log.info(`Proxy domain: ${proxyDomain}`)

        let proxyAuth = null
        try {
            proxyAuth = process.env.PROXY_AUTH || null
            await coresdk.log.info(`Proxy auth info: ${proxyAuth}`)
        } catch (err) {
            await coresdk.log.error(`Failed to get proxy auth info: ${err.message}`)
            proxyAuth = null
        }

        // 3. Build proxy URL
        const proxyUrl = proxyAuth
            ? `socks5://${proxyAuth}@${proxyDomain}`
            : null
        await coresdk.log.info(`Proxy URL: ${proxyUrl}`)

        // 4. Business logic
        const url = inputJson?.url
        await coresdk.log.info(`Start processing URL: ${url}`)

        // Simulated result
        const result = {
            url,
            status: 'success',
            data: [
                {
                    title: 'Sample Title',
                    content: 'Sample Content'
                }
            ]
        }

        // 5. Set table headers
        const headers = [
            {
                label: 'URL',
                key: 'url',
                format: 'text'
            },
            {
                label: 'Status',
                key: 'status',
                format: 'text'
            }
        ]

        await coresdk.result.setTableHeader(headers)

        await coresdk.log.info('Script execution completed')

        // 6. Push result data
        await coresdk.log.info(`Processing result: ${JSON.stringify(result)}`)
        const dataObject = result.data
        for (let index = 0; index < dataObject.length; index++) {
            await coresdk.result.pushData(dataObject[index])
        }

    } catch (err) {
        await coresdk.log.error(`Script execution error: ${err.message}`)

        const errorHeaders = [
            { label: 'Error', key: 'error', format: 'text' },
            { label: 'Error Code', key: 'error_code', format: 'text' },
            { label: 'Status', key: 'status', format: 'text' },
        ]
        await coresdk.result.setTableHeader(errorHeaders)
        const errorResult = {
            error: err.message,
            error_code: '500',
            status: 'failed'
        }

        await coresdk.result.pushData(errorResult)
        throw err
    }
}

run()


```

# Automated Data Scraper: Operation & Principles Guide

### 1. Script Overview

This is an automation tool template. It works like a “digital worker,” automatically opening specified web pages (e.g., social media pages), extracting required information, and organizing it into structured tables.

### 2. How It Works

The process can be simplified into four main stages:

### Step 1: Receive Instructions (Get Input Parameters)

Before starting, you provide instructions (e.g., which webpage to scrape, how many entries to retrieve).

### Step 2: Stealth Preparation (Proxy Network Configuration)

To access restricted or overseas websites smoothly, the script automatically configures a secure tunnel (proxy server).

### Step 3: Automated Job (Business Logic)

This is the core. The script visits target pages, reading titles, content, images, etc., according to the input.

### Step 4: Report Results (Data Push & Table Creation)

After scraping, the script converts raw data into a standardized format and submits it. It also sets up the table headers automatically (e.g., first column “URL,” second column “Content”).

---
# ⭐ Node Dependency Management File (package.json)

This file lists all third-party packages required to run this Node script along with their version information. The system will automatically read this file and install all specified dependencies to ensure the script runs correctly.

### **Dependency List Description**

Below are the Node packages required for this project and their corresponding versions:

Example:
``` json
{
    "name": "node",
    "version": "1.0.0",
    "description": "",
    "main": "main.js",
    "scripts": { 
        "test": "echo Error: no test specified && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "type": "commonjs",
    "dependencies": {
        "@grpc/grpc-js": "^1.13.4",
        "google-protobuf": "^4.0.0"
    }
}
```

### ❗ Important Notes

### 1. Ensure the script runs properly

To ensure the Node script executes smoothly, please make sure to:

- List **all** third-party packages used in the script under the `dependencies` field
- Specify versions for critical core packages whenever possible (e.g. `"@grpc/grpc-js": "^1.13.4"`)
- Regularly update dependency packages to obtain new features and security fixes

## Frequently Asked Questions

**Q: Why do I need to specify version numbers?**

A: Specifying version numbers ensures that the same package versions are used across different environments (development, testing, production), avoiding inconsistent behavior or compatibility issues caused by version differences.

**Q: How do I add new dependency packages?**

A: Simply add a new line to this file following the “package-name==version” or “package-name” format, then re-upload the ZIP archive in the backend. The system will automatically install the dependencies on the next run.

**Q: What should I do if installation fails?**

A: Please check whether the network connection is working properly, or try switching to a different Node package mirror. If the issue persists, contact the system administrator.

---

*Last updated: After modifying script functionality, please ensure this dependency list is updated accordingly to reflect all newly added package dependencies.*
