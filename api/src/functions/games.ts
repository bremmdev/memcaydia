import { app, HttpResponseInit } from "@azure/functions";
import {
  CosmosClient,
  Container,
  Database,
  SqlQuerySpec,
  FeedResponse,
} from "@azure/cosmos";
import type { Game } from "../types";

export async function getGames(): Promise<HttpResponseInit> {
  const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
  });

  const database: Database = client.database("db");
  const container: Container = database.container("games");

  const querySpec: SqlQuerySpec = {
    query:
      "SELECT games.id, games.name, games.description, games.category, games.image FROM games",
  };

  try {
    const response: FeedResponse<Game> = await container.items
      .query<Game>(querySpec)
      .fetchAll();

    return {
      status: 200,
      jsonBody: response.resources,
    };
  } catch {
    return {
      status: 500,
      body: "An error occurred while fetching games",
    };
  }
}

app.http("games", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getGames,
});
