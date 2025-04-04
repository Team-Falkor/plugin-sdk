# Falkor Plugin SDK

The Falkor Plugin SDK is a TypeScript-based toolkit for building and managing plugins within the Falkor ecosystem. It leverages the power of [Elysia](https://elysiajs.com/) for a robust server framework and is optimized for the [Bun](https://bun.sh/) runtime.

## Key Features

- **Streamlined Plugin API:** Easily create plugins with a simple and intuitive interface.
- **Built-in Handlers:** Comes with pre-configured search and return handlers.
- **TypeScript-Ready:** Enjoy full TypeScript support right out of the box.
- **CORS Support:** Integrated CORS support via [@elysiajs/cors](https://www.npmjs.com/package/@elysiajs/cors).
- **Debug Options:** Configurable debugging to help streamline your development process.

## Installation

Install the SDK using your preferred package manager:

```bash
# Using npm
npm install @team-falkor/plugin-sdk

# Using yarn
yarn add @team-falkor/plugin-sdk

# Using bun
bun add @team-falkor/plugin-sdk
```

## Quick Start

Below is a quick example to get you started:

```typescript
import { createPlugin } from 'falkor-plugin-sdk';

const plugin = createPlugin({
  setup: {
    id: "my.awesome.plugin",
    version: "1.0.0",
    multiple_choice: false,
    name: 'my-plugin',
    description: 'My awesome Falkor plugin',
    logo: "URL_ADDRESS_to_image.com",
    banner: "URL_ADDRESS_to_image.com" // optional,
  },
  port: 3000,
  handleSearch: async (query) => {
    // Implement your search logic here
    return { results: [] };
  },
  handleReturn: async (data) => {
    // Handle return data here
    return { success: true };
  },
  options: {
    debug: true, // Enable debug mode
  },
});
```

## API Reference

### `createPlugin(options)`

Creates a new Falkor plugin instance with the specified configuration.

#### Options

- **`setup`** (object): Plugin metadata.
  - **`id`**: A unique identifier for the plugin.
  - **`version`**: The version of the plugin, used to determine compatibility.
  - **`multiple_choice`**: A boolean indicating whether the needs an extra request to get the source. If `true`, additional requests may be needed to fetch source links.
  - **`name`**: The name of the plugin, displayed in the settings menu.
  - **`description`**: A description of the plugin, shown in the settings menu.
  - **`logo`**: A URL to the plugin's logo, displayed in the settings menu.
  - **`banner`**: A URL to the plugin's banner, displayed in the settings menu. (Optional)
  - **`api_url`**: The base URL for the plugin's API, used for making requests.
  - **`author`**: Information about the author of the plugin. (Optional)
  - **`setup_path`**: Used for updating the plugin from within the app
- **`port`** (number): The port number on which the plugin server will run.
- **`handleSearch`** (async function): Function to process search requests.
- **`handleReturn`** (async function): Function to process return data.
- **`options`** (object): Additional configuration settings.
  - **`debug`** (boolean): Enable debug mode for more verbose logging.

## Development

To start the development server with hot reload, run:

```bash
bun run dev
```

## Contributing

Contributions are highly appreciated! If you have suggestions or improvements, feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
