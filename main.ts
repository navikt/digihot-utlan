import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

import { defaultFnr, data } from "./data.ts";

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
    const { fnr } = await context.request.body.json();
    const { aidItems } = data.get(fnr) ??
      data.get(defaultFnr) ?? { aidItems: [] };
    const since = context.request.url.searchParams.get("since");
    context.response.headers.set("Access-Control-Allow-Origin", "*");
    context.response.body = {
      aidItems: since
        ? aidItems.filter(
            (it) =>
              new Date(it.updatedDate).getTime() >= new Date(since).getTime()
          )
        : aidItems,
    };
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
