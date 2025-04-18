import Elysia, { t } from "elysia";
import { HandleReturnFunction } from "../../types";
import { Colors } from "../utils/colors";

export function registerReturnRoute(
  app: Elysia,
  getHandler: () => HandleReturnFunction | null,
  debug: boolean
) {
  const handler = getHandler();
  if (!handler) return; // skip if none

  app.get(
    "/return/:returned",
    async ({ params }) => {
      const results = await handler(params.returned);
      if (debug) {
        console.log(
          Colors.create("[plugin] Return:").cyan.toString(),
          Colors.create(`val=${params.returned}`).magenta.toString(),
          Colors.create(`hits=${results.length}`).green.toString()
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
}
