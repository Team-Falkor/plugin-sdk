import type Elysia from "elysia";
import type { CreatePluginOptions } from "../../types";
import { Plugin } from "../Plugin";

const plugin = Plugin.instance;

/**
 * Configure and start your Falkor plugin in one go.
 *
 * @param options.setup       – core plugin metadata (name, api_url, etc.)
 * @param options.port        – TCP port to listen on (must be > 0)
 * @param options.handleSearch– your search handler (required)
 * @param options.handleReturn– your return handler (optional)
 * @param options.options.debug – enable verbose debug logging
 * @returns the underlying Elysia app instance
 */
export function createPlugin({
  setup,
  port,
  handleSearch,
  handleReturn,
  handleSetup,
  options = {
    debug: false,
  },
  routeOptions = {
    typeOfConfig: "query",
  },
}: CreatePluginOptions): Elysia {
  if (!setup) {
    throw new Error("`setup` object is required to initialize the plugin.");
  }
  if (typeof port !== "number" || port <= 0) {
    throw new Error("`port` must be a positive number.");
  }
  if (typeof handleSearch !== "function") {
    throw new Error("`handleSearch` must be a function.");
  }

  plugin.setupApp = setup;

  plugin.handlers = {
    search: handleSearch,
    ...(handleReturn && { return: handleReturn }),
    ...(handleSetup && { setup: handleSetup }),
  };

  plugin.extraOptions = { ...options };
  plugin.routeConfig = { ...routeOptions };

  plugin.listen(port);

  return plugin.appInstance;
}
