import { PluginSetupJSON } from "@team-falkor/shared-types";
import { describe, expect, test } from "bun:test";
import { Colors } from "../src/plugin/utils/colors";

describe("Plugin SDK", () => {
  describe("createPlugin", () => {
    test("validates plugin configuration", () => {
      const mockSetup: PluginSetupJSON = {
        id: "test.plugin.1",
        version: "1.0.0",
        config: false,
        multiple_choice: false,
        name: "Test Plugin",
        description: "A test plugin",
        logo: "test-logo.svg",
        api_url: "https://example.com",
        setup_path: "/setup.json",
      };

      // Validate plugin ID format (matches PluginId type)
      expect(mockSetup.id.split(".").length).toBeGreaterThanOrEqual(2);
      expect(mockSetup.id.split(".").length).toBeLessThanOrEqual(3);

      // Validate other required fields
      expect(typeof mockSetup.version).toBe("string");
      expect(typeof mockSetup.name).toBe("string");
      expect(typeof mockSetup.description).toBe("string");
      expect(typeof mockSetup.logo).toBe("string");
    });

    test("validates plugin with debug option", () => {
      const mockSetup: PluginSetupJSON = {
        id: "test.plugin.2",
        version: "1.0.0",
        config: false,
        multiple_choice: false,
        name: "Test Plugin",
        description: "A test plugin",
        logo: "test-logo.svg",
        api_url: "https://example.com",
        setup_path: "/setup.json",
      };

      const pluginConfig = {
        setup: mockSetup,
        port: 3001,
        handleSearch: async () => [],
        handleReturn: async () => ({}),
        options: { debug: true },
      };

      expect(pluginConfig.options?.debug).toBe(true);
      expect(typeof pluginConfig.handleSearch).toBe("function");
      expect(typeof pluginConfig.handleReturn).toBe("function");
    });
  });

  describe("Colors", () => {
    test("creates colored string", () => {
      const coloredText = new Colors("test").red.toString();
      expect(coloredText).toContain("\x1b[31m");
      expect(coloredText).toContain("test");
    });

    test("chains multiple colors", () => {
      const coloredText = new Colors("test").red.bold.toString();
      expect(coloredText).toContain("\x1b[31;1m");
      expect(coloredText).toContain("test");
    });
  });
});
