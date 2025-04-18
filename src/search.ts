import { MeiliSearch } from "meilisearch";
import pokemon from "./pokedex.json";

const indexName = 'pokemon-index'

export class SearchService {

  static getSearchClient() {
    return new MeiliSearch({
      host: process.env.MEILISEARCH_URL!,
      apiKey: process.env.MEILISEARCH_API_KEY,
    });
  }

  static async buildIndex() {
    const client = this.getSearchClient();
    await client.createIndex(indexName, { primaryKey: 'id' });
    await this.setIndexSettings();
  }

  static async setIndexSettings() {
    const client = this.getSearchClient();
    await client.index(indexName).updateSettings({
      searchableAttributes: [
       'name.english',
       'species',
       'description',
      ],
      filterableAttributes: [
        'profile.height',
        'profile.weight',
        'base.Hp',
        'base.Attack',
        'type',
        // 'profile.egg',
      ],
      sortableAttributes: [
        'profile.height',
        'profile.weight',
        'base.Hp',
        'base.Attack',
      ],
      pagination: {
        maxTotalHits: 100000,
      },
      faceting: {
        maxValuesPerFacet: 1000,
        sortFacetValuesBy: {
          '*': 'count',
        },
      },
    });

    // const result = await client.index(indexName).updateEmbedders({
    //   'pokemon-openai': {
    //     source: 'openAi',
    //     model: 'text-embedding-3-small',
    //     apiKey: process.env.OPENAI_KEY,
    //     documentTemplate: `
    //         Pokemon name: {{doc.name.english}}
    //         species: {{doc.species}}
    //         description: {{doc.description}}
    //       `,
    //   },
    // });
  }

  static async indexPokemon() {
    const client = this.getSearchClient();
    await client.index(indexName).addDocuments(pokemon);
  }

  static async search(
    data: any,
  ) {
    const searchFilters: string[] = [];
    // Build the filters based on the request
    //
    if (data.attack_min) {
      searchFilters.push(
        `base.Attack >= ${data.attack_min}`,
      );
    }
    if (data.attack_max) {
      searchFilters.push(
        `base.Attack <= ${data.attack_max}`,
      );
    }

    if (data.egg) {
      for (const egg of data.egg) {
        searchFilters.push(
          `profile.egg = ${egg}`,
        );
      }
    }
    // if (data.type) {
    //   for (const type of data.type) {
    //     searchFilters.push(
    //       `type = ${type}`,
    //     );
    //   }
    // }

    const client = this.getSearchClient();

    const searchOptions: any = {
      filter: searchFilters,
      facets: [
        'type',
        'base.Attack',
      ],
      // hybrid: {
      //     embedder: 'pokemon-openai',
      //     semanticRatio: 0.6, // https://www.meilisearch.com/docs/reference/api/search#hybrid-search
      // },
      showRankingScore: true,
    };

    const results = await client
      .index(indexName)
      .search(data?.query, searchOptions);
    return results;
  }

  static async removeIndex() {
    const client = this.getSearchClient();
    await (await client.getIndex(indexName)).delete();
  }

  static async getTasks() {
    const client = this.getSearchClient();
    const tasks = await client.tasks.getTasks();
    return tasks;
  }
}
