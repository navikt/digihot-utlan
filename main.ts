import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

import { defaultFnr, data } from "./data.ts";

function createRandomDate(yearsBack: number = 5): Date {
  const now = new Date();
  const pastTime =
    now.getTime() - Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000;
  return new Date(pastTime);
}

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello, DigiHoT!";
  })
  .get("/isready", (context) => {
    context.response.body = "READY";
  })
  .get("/isalive", (context) => {
    context.response.body = "ALIVE";
  })
  .post("/utlan", async (context) => {
    const since = context.request.url.searchParams.get("since");
    const { fnr } = await context.request.body.json();
    const { aidItems } = data.get(fnr) ??
      data.get(defaultFnr) ?? { aidItems: [] };
    context.response.body = {
      aidItems: aidItems.filter(
        (it) =>
          !since ||
          new Date(it.updatedDate).getTime() >= new Date(since).getTime()
      ),
    };
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
