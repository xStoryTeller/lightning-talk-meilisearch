# Meilisearch Pokemon Lightning Talk


## Development
To start the development server run:
```bash
bun run dev
```

# Open http://localhost:3000/swagger for info on the routes

# Order of things:
GET - http://localhost:3000/pokemon/create-index
GET - http://localhost:3000/pokemon/fill-index
POST - http://localhost:3000//pokemon/search

# Example bodies:
```{
    "query": "mouse"
}```

```{
  "query": "",
  "attack_min": 81,
  "attack_max": 81
}```

```{
  "query": "legendary",
  "attack_min": 81,
  "type": ["fire"]
}```

## Local Meilisearch
# Install Meilisearch
curl -L https://install.meilisearch.com | sh

# Launch Meilisearch
./meilisearch

# Default location
http://localhost:7700/


## Data
The pokemon data was taken from: https://github.com/Purukitto/pokemon-data.json/blob/master/pokedex.json