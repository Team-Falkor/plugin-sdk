import {
  PluginSearchResponse,
  PluginSetupJSON,
} from "@team-falkor/shared-types";

export type PluginSetupWithoutConfig = Omit<PluginSetupJSON, "config">;

export type HandleSearchFunction = (
  os: string,
  query: string
) => PromiseLike<Array<PluginSearchResponse>>;

export type HandleReturnFunction = (
  returned: string
) => PromiseLike<Array<string>>;

export type CustomHandleSetupFunction = (
  config?: string[]
) => PromiseLike<PluginSetupJSON>;

export type CreatePluginExtraOptions = {
  debug?: boolean;
};

export interface CreatePluginOptions {
  setup: PluginSetupWithoutConfig;
  port: number;
  handleSearch: HandleSearchFunction;
  handleReturn?: HandleReturnFunction;
  handleSetup?: CustomHandleSetupFunction;
  options?: CreatePluginExtraOptions;
  routeOptions?: SetupJsonOptions;
}

export type TypeOfConfig = "query" | "params";

export type SetupJsonOptions = {
  typeOfConfig: TypeOfConfig;
};
