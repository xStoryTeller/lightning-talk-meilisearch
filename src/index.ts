import { Elysia } from "elysia";
import { SearchService } from "./search";
import swagger from "@elysiajs/swagger";

const app = new Elysia()

.get("/pokemon/create-index", async () => {
  await SearchService.buildIndex();
  return "Index created";
})

.get("/pokemon/update-index", async () => {
  await SearchService.setIndexSettings();
  return "Index updated";
})

.get("/pokemon/fill-index", async () => {
  await SearchService.indexPokemon();
  return "Index filled";
})

.get("/pokemon/remove-index", async () => {
  await SearchService.removeIndex();
  return "Index removed";
})

.get("/pokemon/get-tasks", async () => {
  return await SearchService.getTasks();
})

.post("/pokemon/search", async ({ body }) => {
  return await SearchService.search(body);
})


.use(swagger())

.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
