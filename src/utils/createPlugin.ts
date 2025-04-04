import Elysia from "elysia";
import { CreatePluginOptions, PluginSetupJSON } from "../types";
import { plugin } from "./buildPlugin";


export const createPlugin = (options: CreatePluginOptions) => {
    const { setup, port, handleSearch, handleReturn } = options;

    plugin.setupApp = {
        ...setup,
    }

    plugin.handlers = {
        search: handleSearch,
        return: handleReturn,
    }

    const extraOptions = options.options;

    if (extraOptions) {    
        plugin.extraOptions = {
            debug: extraOptions.debug,
        }
    }

    plugin.listen(port);
}