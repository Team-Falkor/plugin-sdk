import { PluginSetupJSON } from "@team-falkor/shared-types";
import Elysia, { t } from "elysia";
import { PluginSetupWithoutConfig } from "../../types";
import { Colors } from "../utils/colors";

export function registerSetupRoute(
  app: Elysia,
  setupData: PluginSetupWithoutConfig,
  debug: boolean
) {
  app.get(
    "/setup.json",
    ({ query }) => {
      if (debug) {
        console.log(
          Colors.create("[plugin] GET /setup.json").blue.toString(),
          query?.search
            ? Colors.create(
                `filters: ${query.search.join(", ")}`
              ).magenta.toString()
            : ""
        );
      }

      const response: PluginSetupJSON = {
        ...setupData,
        config: query?.search ? { search: query.search } : false,
      };
      return response;
    },
    {
      query: t.Optional(
        t.Object({
          search: t.Array(t.String()),
        })
      ),
    }
  );
}
