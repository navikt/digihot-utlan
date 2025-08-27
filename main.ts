import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { utlån } from "./data.ts";

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
    const fnr = await context.request.body.text();
    context.response.body = utlån.get(fnr);
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
