import { PluginSearchResponse } from "@team-falkor/shared-types";
import Elysia, { t } from "elysia";
import { HandleSearchFunction } from "../../types";
import { Colors } from "../utils/colors";

export function registerSearchRoute(
  app: Elysia,
  getHandler: () => HandleSearchFunction | null,
  debug: boolean
) {
  app.get(
    "/search/:os/:query",
    async ({ params }): Promise<PluginSearchResponse[]> => {
      const handler = getHandler();
      if (!handler) {
        throw new Error("Search handler not set");
      }

      const results = await handler(params.os, params.query);
      if (debug) {
        console.log(
          Colors.create("[plugin] Search:").green.toString(),
          Colors.create(`OS=${params.os}`).yellow.toString(),
          Colors.create(`q=${params.query}`).yellow.toString(),
          Colors.create(`hits=${results.length}`).green.toString()
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
}
