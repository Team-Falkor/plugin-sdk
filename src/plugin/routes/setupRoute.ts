import { PluginSetupJSON } from "@team-falkor/shared-types";
import Elysia, { t } from "elysia";
import {
  CustomHandleSetupFunction,
  PluginSetupWithoutConfig,
  SetupJsonOptions,
} from "../../types";
import { Colors } from "../utils/colors";

export function registerSetupRoute(
  app: Elysia,
  setupData: PluginSetupWithoutConfig,
  debug: boolean,
  getHandler: CustomHandleSetupFunction | null,
  options: SetupJsonOptions = {
    typeOfConfig: "query",
  }
) {
  if (options.typeOfConfig === "query")
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

        if (getHandler) {
          const response = getHandler(query?.search);
          return response;
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

  if (options.typeOfConfig === "params")
    app.get(
      ":search/setup.json",
      ({ params }) => {
        const search = params.search?.split("%20");

        if (debug) {
          console.log(
            Colors.create("[plugin] GET /setup.json").blue.toString(),
            search ? Colors.create(`filters: ${search}`).magenta.toString() : ""
          );
        }

        if (getHandler) {
          const response = getHandler(search);
          return response;
        }

        const response: PluginSetupJSON = {
          ...setupData,
          config: search ? { search: search } : false,
        };
        return response;
      },
      {
        params: t.Object({
          search: t.String(),
        }),
      }
    );
}
