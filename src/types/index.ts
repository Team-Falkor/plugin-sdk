import {
  PluginSetupJSON,
  PluginSearchResponse,
} from "@team-falkor/shared-types";

export type PluginSetupWithoutConfig = Omit<PluginSetupJSON, "config">;

export type HandleSearchFunction = (
  os: string,
  query: string
) => PromiseLike<Array<PluginSearchResponse>>;
export type HandleReturnFunction = (
  returned: string
) => PromiseLike<Array<string>>;

export interface CreatePluginExtraOptions {
  debug?: boolean;
}

export interface CreatePluginOptions {
  setup: PluginSetupWithoutConfig;
  port: number;
  handleSearch: HandleSearchFunction;
  handleReturn?: HandleReturnFunction;
  options?: CreatePluginExtraOptions;
}
