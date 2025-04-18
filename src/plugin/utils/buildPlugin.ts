import cors from "@elysiajs/cors";
import {
  PluginSearchResponse,
  PluginSetupJSON,
} from "@team-falkor/shared-types";
import Elysia, { t } from "elysia";
import type {
  CreatePluginExtraOptions,
  HandleReturnFunction,
  HandleSearchFunction,
  PluginSetupWithoutConfig,
} from "../../types";
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

  public set setupApp(setup: PluginSetupWithoutConfig) {
    this.setupData = setup;
  }

  public set handlers(handlers: {
    search: HandleSearchFunction;
    return?: HandleReturnFunction;
  }) {
    this.searchHandler = handlers.search;
    this.returnHandler = handlers.return ?? null;
  }

  public set extraOptions(options: CreatePluginExtraOptions) {
    this.debug = options.debug ?? false;
  }

  public listen(port: number): void {
    if (this.hasAppStarted) {
      throw new Error("App has already started and cannot be started again.");
    }

    if (!this.setupData) {
      throw new Error(
        "Plugin setup is missing. Please set `createPlugin({setup: {}})` first."
      );
    }

    this.hasAppStarted = true;
    this.setupRoutes();

    this.app.listen(port, (server) => {
      const apiUrl = this.setupData?.api_url?.length
        ? this.setupData.api_url
        : server.url.href;

      if (!this.setupData) {
        console.error(
          Colors.create("[plugin] Setup data is null").red.bold.toString()
        );
        return;
      }

      this.setupData = {
        ...this.setupData,
        api_url: apiUrl,
        setup_path: this.setupData.setup_path || `/setup.json`,
      };

      if (this.debug) {
        console.info(
          Colors.create("[plugin] Plugin is now running at ")
            .green.bold.withSuffix(apiUrl)
            .toString()
        );
      }

      const installLink = `falkor://install-plugin/${apiUrl}/setup.json`;
      console.log(
        Colors.create("[plugin] Install via: ")
          .cyan.bold.withSuffix(installLink)
          .toString()
      );
    });
  }

  public get appInstance(): Elysia {
    if (!this.setupData) {
      throw new Error("Plugin setup is missing. Please set `setupApp` first.");
    }
    return this.app;
  }

  private setupRoutes(): void {
    if (!this.setupData) {
      throw new Error("Plugin setup is missing. Please set `setupApp` first.");
    }

    this.app.get(
      "/setup.json",
      ({ query }) => {
        const search = query?.search;

        if (this.debug) {
          console.log(
            Colors.create("[plugin] Setup route hit").blue.toString(),
            search
              ? Colors.create(
                  `Search terms: ${search.join(", ")}`
                ).magenta.toString()
              : ""
          );
        }

        if (!this.setupData) {
          console.error(
            Colors.create(
              "[plugin] Error: Setup data is null"
            ).red.bold.toString()
          );
          return null;
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

    this.app.get(
      "/search/:os/:query",
      async ({ params }): Promise<Array<PluginSearchResponse>> => {
        if (!this.searchHandler) {
          throw new Error("Search handler is not set.");
        }

        const { os, query } = params;
        const results = await this.searchHandler(os, query);

        if (this.debug) {
          console.log(
            Colors.create("[plugin] Search triggered").green.toString(),
            Colors.create(`OS: ${os}`).yellow.toString(),
            Colors.create(`Query: ${query}`).yellow.toString(),
            Colors.create(`Result count: ${results.length}`).green.toString()
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

    if (this.returnHandler) {
      this.app.get(
        "/return/:returned",
        async ({ params }): Promise<Array<string>> => {
          const { returned } = params;
          const results = await this.returnHandler!(returned);

          if (this.debug) {
            console.log(
              Colors.create("[plugin] Return route hit").cyan.toString(),
              Colors.create(`Returned: ${returned}`).magenta.toString(),
              Colors.create(`Result count: ${results.length}`).green.toString()
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
      console.warn(
        Colors.create(
          "[plugin] Skipping /return route - no return handler set"
        ).yellow.toString()
      );
    }
  }
}

export const plugin = Plugin.getInstance();
