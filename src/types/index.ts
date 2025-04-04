import { PluginSearchResponse } from "./providers";
import { PluginSetupWithoutConfig } from "./setup";

export type HandleSearchFunction = (os: string, query: string) => PromiseLike<Array<PluginSearchResponse>>;
export type HandleReturnFunction = (returned: string) => PromiseLike<Array<string>>;

export interface CreatePluginExtraOptions {
    debug?: boolean,
}

export interface CreatePluginOptions  {
    setup: PluginSetupWithoutConfig,
    port: number,
    handleSearch: HandleSearchFunction,
    handleReturn?: HandleReturnFunction,
    options?: CreatePluginExtraOptions
}


export * from "./providers";
export * from "./setup";
