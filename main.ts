import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const utlån = new Map<string, any>();
utlån.set("03128221750", {
  hjelpemidler: [],
});

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
  .get("/utlan", (context) => {
    context.response.body = Array.from(utlån.values());
  })
  .get("/utlan/:id", (context) => {
    if (utlån.has(context?.params?.id)) {
      context.response.body = utlån.get(context.params.id);
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
