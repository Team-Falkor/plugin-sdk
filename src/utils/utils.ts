import { PluginConfig, PluginSetupJSON } from "../types";

export const createSetup = (setup: Omit<PluginSetupJSON, "config">) => ({...setup})