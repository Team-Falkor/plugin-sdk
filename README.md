# Falkor Plugin SDK

The **Falkor Plugin SDK** is a TypeScript toolkit for building and managing plugins within the **Falkor ecosystem** ([Falkor GitHub](https://github.com/Team-Falkor/falkor)). It uses [Elysia](https://elysiajs.com/) as the web framework and is optimized for the [Bun](https://bun.sh/) runtime.

## 🚀 Key Features

- **Streamlined Plugin API** – Build plugins easily with a clean and intuitive interface for the Falkor ecosystem.
- **Built-in Handlers** – Includes default setup for `search` and `return` routes.
- **TypeScript Support** – Full typings and type safety throughout the SDK.
- **CORS Integration** – Out-of-the-box support via [@elysiajs/cors](https://www.npmjs.com/package/@elysiajs/cors).
- **Debug Logging** – Optional debug mode with color-coded console output for easier development.

## 📦 Installation

Install via your favorite package manager:

```bash
npm install @team-falkor/plugin-sdk
```

```bash
yarn add @team-falkor/plugin-sdk
```

```bash
pnpm add @team-falkor/plugin-sdk
```

```bash
bun add @team-falkor/plugin-sdk
```

## ⚡ Quick Start

Here's an example of how to create a plugin for Falkor using the SDK:

```ts
import { createPlugin } from "falkor-plugin-sdk";

createPlugin({
  setup: {
    id: "my.awesome.plugin",
    version: "1.0.0",
    multiple_choice: false,
    name: "my-plugin",
    description: "My awesome Falkor plugin",
    logo: "https://yourdomain.com/logo.png",
    banner: "https://yourdomain.com/banner.png", // Optional
    api_url: "htpps://yourdomain.com",
    setup_url: `/setup.json?search=["config-option-1", "config-option-2"]`, // used for auto updating the plugin
  },
  port: 3000,
  handleSearch: async (query) => {
    // Your search logic here
    return { results: [{}] };
  },
  handleReturn: async (data) => {
    // Handle return data here
    // You have to return an array of links but you can send as many links as you want
    return ["link1", "link2"];
  },
  options: {
    debug: true, // Enable debug mode for verbose logs
  },
});
```

## 📚 API Reference

### `createPlugin(options)`

Creates and starts a new plugin server for Falkor.

#### Parameters

- **`setup`** (object) – Plugin metadata and configuration:

  - `id`: Unique identifier for the plugin.
  - `version`: Version number for compatibility checks.
  - `multiple_choice`: If `true`, the plugin requires additional requests to fetch sources.
  - `name`: Display name of the plugin.
  - `description`: Short description of the plugin functionality.
  - `logo`: URL to the plugin's logo (square image).
  - `banner`: URL to the plugin's banner (optional).
  - `api_url`: Optional base URL for your plugin API.
  - `author`: Optional information about the plugin author.
  - `setup_path`: Path to access the setup data, default is `/setup.json`.

- **`port`** (number) – The port on which the plugin server will run.
- **`handleSearch`** (function) – Async function to handle search requests.
- **`handleReturn`** (function) – Async function to handle return data.
- **`options`** (object) – Additional configuration:
  - `debug` (boolean): Enable debug mode for detailed logging.

## 🛠 Development

To run the development server with hot reload, use:

```bash
bun run dev
```

Ensure you have `bun` installed globally.

## 🤝 Contributing

We welcome contributions! If you have suggestions or improvements, feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
