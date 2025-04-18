import cors from "@elysiajs/cors";
import Elysia from "elysia";
import type {
  CreatePluginExtraOptions,
  CustomHandleSetupFunction,
  HandleReturnFunction,
  HandleSearchFunction,
  PluginSetupWithoutConfig,
  SetupJsonOptions,
} from "../types";
import {
  registerReturnRoute,
  registerSearchRoute,
  registerSetupRoute,
} from "./routes/";
import { Colors } from "./utils/colors";

export class Plugin {
  private app = new Elysia().use(cors());
  private debug = false;
  private routeOptions: SetupJsonOptions = {
    typeOfConfig: "query",
  };
  private searchHandler: HandleSearchFunction | null = null;
  private returnHandler: HandleReturnFunction | null = null;
  private customSetupHandler: CustomHandleSetupFunction | null = null;
  private setupData: PluginSetupWithoutConfig | null = null;
  private started = false;

  /** Singleton */
  private static _instance: Plugin;
  private constructor() {}
  public static get instance() {
    return this._instance || (this._instance = new Plugin());
  }

  /** Core configuration */
  public set setupApp(data: PluginSetupWithoutConfig) {
    this.setupData = data;
  }

  /** Handlers */
  public set handlers({
    search,
    return: ret,
    setup,
  }: {
    search: HandleSearchFunction;
    return?: HandleReturnFunction;
    setup?: CustomHandleSetupFunction;
  }) {
    this.searchHandler = search;
    this.returnHandler = ret ?? null;
    this.customSetupHandler = setup ?? null;
  }

  /** Extra options (e.g. debug) */
  public set extraOptions(opts: CreatePluginExtraOptions) {
    this.debug = opts.debug ?? false;
  }

  /** Route options  */
  public set routeConfig(opts: SetupJsonOptions) {
    this.routeOptions = opts;
  }

  /** Kick off the HTTP server */
  public listen(port: number): void {
    if (this.started) {
      throw new Error("Plugin already started");
    }
    if (!this.setupData) {
      throw new Error("Missing setupData; call setupApp first");
    }

    this.started = true;
    this.registerRoutes();
    this.app.listen(port, (ctx) => {
      const url = this.setupData?.api_url?.length
        ? this.setupData?.api_url
        : ctx.url.href;
      if (this.debug) {
        console.info(
          Colors.create("[plugin] Listening on ")
            .green.bold.withSuffix(url)
            .toString()
        );
      }
      console.log(
        Colors.create("[plugin] Install via: ")
          .cyan.bold.withSuffix(`falkor://install-plugin/${url}/setup.json`)
          .toString()
      );
    });
  }

  /** Expose the raw Elysia instance */
  public get appInstance() {
    if (!this.setupData) {
      throw new Error("Missing setupData; call setupApp first");
    }
    return this.app;
  }

  /** Wire up all the routes */
  private registerRoutes() {
    if (!this.setupData) {
      throw new Error("Missing setupData; call setupApp first");
    }

    registerSetupRoute(
      this.app,
      this.setupData,
      this.debug,
      this.customSetupHandler,
      this.routeOptions
    );
    registerSearchRoute(this.app, () => this.searchHandler, this.debug);
    registerReturnRoute(this.app, () => this.returnHandler, this.debug);
  }
}
