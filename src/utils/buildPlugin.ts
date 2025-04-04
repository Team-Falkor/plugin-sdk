import Elysia, { t } from "elysia";
import cors from "@elysiajs/cors";
import {
  CreatePluginExtraOptions,
  HandleReturnFunction,
  HandleSearchFunction,
  PluginSearchResponse,
  PluginSetupJSON,
  PluginSetupWithoutConfig,
} from "../types";
import { Colors } from "./colors";

export class Plugin {
  private app = new Elysia().use(cors());
  private debug = false;
  private searchHandler: HandleSearchFunction | null = null;
  private returnHandler: HandleReturnFunction | null = null;
  private setupData: PluginSetupWithoutConfig | null = null;
  private hasAppStarted = false;
  private static instance: Plugin;

  private constructor() {}

  public static getInstance(): Plugin {
    if (!Plugin.instance) {
      Plugin.instance = new Plugin();
    }
    return Plugin.instance;
  }

  /**
   * Set the initial configuration for the plugin.
   */
  public set setupApp(setup: PluginSetupWithoutConfig) {
    this.setupData = setup;
  }

  /**
   * Set handlers for search and (optionally) return functionality.
   */
  public set handlers(handlers: {
    search: HandleSearchFunction;
    return?: HandleReturnFunction;
  }) {
    this.searchHandler = handlers.search;
    this.returnHandler = handlers.return ?? null;
  }

  /**
   * Set extra options such as debugging.
   */
  public set extraOptions(options: CreatePluginExtraOptions) {
    this.debug = options.debug ?? false;
  }

  /**
   * Start listening on the provided port.
   */
  public listen(port: number): void {
    if (this.hasAppStarted) {
      throw new Error("App has already started, cannot start again");
    }
    if (!this.setupData) {
      throw new Error("Setup not set, please use setupApp setter first.");
    }
    this.hasAppStarted = true;
    this.setupRoutes();

    this.app.listen(port, (server) => {
      const apiUrl = this.setupData?.api_url ?? server.url.href;

      // Ensure the setup object has required URL properties
    

      if (!this.setupData) {
        console.error(Colors.create(`Setup data is null`).red);
        return
      };

      this.setupData = {
        ...this.setupData,
        api_url: apiUrl,
        setup_path: this.setupData?.setup_path ? this.setupData.setup_path : `/setup.json`,
      };

      if (this.debug) {
        console.info(`Plugin running on ${apiUrl}`);
      }
    });
  }

  /**
   * Returns the underlying Elysia app instance.
   */
  public get appInstance(): Elysia {
    if (!this.setupData) {
      throw new Error("Setup not set, please use setupApp setter first.");
    }
    return this.app;
  }

  /**
   * Setup the API routes.
   */
  private setupRoutes(): void {
    if (!this.setupData) {
      throw new Error("Setup not set, please use setupApp setter first.");
    }

    // Setup route for retrieving setup configuration
    this.app.get(
      "/setup.json",
      ({ query }) => {
        const search = query?.search;
        if (this.debug) {
          console.log(
            Colors.create("Setup Requested").toString(),
            Colors.create(`Search: ${search}`).toString()
          );
        }
        if (!search) return this.setupData;

        if (!this.setupData) {
            console.error(Colors.create(`Setup data is null`).red);
            return null
        }

        const setupResponse: PluginSetupJSON = {
          ...this.setupData,
          config: search ? { search } : false,
        };
        return setupResponse;
      },
      {
        query: t.Optional(
          t.Object({
            search: t.Array(t.String()),
          })
        ),
      }
    );

    // Setup search route
    this.app.get(
      "/search/:os/:query",
      async ({ params }): Promise<Array<PluginSearchResponse>> => {
        if (!this.searchHandler) {
          throw new Error("Search handler not set");
        }
        const { os, query } = params;
        const results = await this.searchHandler(os, query);
        if (this.debug) {
          console.log(
            Colors.create("Search Requested").green.toString(),
            Colors.create(`OS: ${os}`).toString(),
            Colors.create(`Query: ${query}`).toString(),
            Colors.create(`Results: ${results.length}`).toString()
          );
        }
        return results;
      },
      {
        params: t.Object({
          os: t.String(),
          query: t.String(),
        }),
      }
    );

    // Setup return route if a handler is provided
    if (this.returnHandler) {
      this.app.get(
        "/return/:returned",
        async ({ params }): Promise<Array<string>> => {
          const { returned } = params;
          const results = await this.returnHandler!(returned);
          if (this.debug) {
            console.log(
              Colors.create("Return Requested").toString(),
              Colors.create(`Returned: ${returned}`).toString(),
              Colors.create(`Results: ${results.length}`).toString()
            );
          }
          return results;
        },
        {
          params: t.Object({
            returned: t.String(),
          }),
        }
      );
    } else if (this.debug) {
      console.warn("Return handler not set, skipping /return route");
    }
  }
}

// Export a singleton instance for external use
export const plugin = Plugin.getInstance();
