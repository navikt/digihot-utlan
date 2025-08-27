import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

import { defaultFnr, utlån, UtlåntHjelpemiddelV2 } from "./data.ts";

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
    context.response.body = utlån.get(fnr) ?? utlån.get(defaultFnr);
  })
  .post("/utlan-v2", async (context) => {
    const { fnr } = await context.request.body.json();
    const { hjelpemidler } = utlån.get(fnr) ??
      utlån.get(defaultFnr) ?? { hjelpemidler: [] };
    context.response.body = {
      hjelpemidler: hjelpemidler.map(
        (it): UtlåntHjelpemiddelV2 => ({
          hmsArtNr: it.hmsnr,
          antall: it.antall,
          antallEnhet: it.antallEnhet,
          serialNr: it.serieNr,
          status: it.status,
          datoUtsendelse: it.datoUtsendelse,
          articleName: it.grunndataProduktNavn ?? it.beskrivelse,
          isoCategory: it.isoKode,
          isoCategoryTitle: it.isoKategori,
          productURL: it.hjelpemiddeldatabasenURL,
          imageURL: it.grunndataBilde,
        })
      ),
    };
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
