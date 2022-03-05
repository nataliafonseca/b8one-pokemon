async function fetchPokemons() {
  const pokemons = [];

  for (let i = 1; i <= 20; i++) {
    const { name, types, sprites, stats } = await fetchPokemonInfo(
      `https://pokeapi.co/api/v2/pokemon/${i}/`
    );
    pokemons.push({ name, types, sprites, stats });
  }

  return pokemons;
}

async function fetchPokemonInfo(url) {
  const response = await fetch(url).then((data) => data.json());
  return response;
}

async function insertPokemonHtml(pokemon) {
  const { name, types, sprites, stats } = pokemon;
  const hpStat = stats.find((item) => item.stat.name === "hp");
  const attackStat = stats.find((item) => item.stat.name === "attack");
  const defenseStat = stats.find((item) => item.stat.name === "defense");
  const spAttackStat = stats.find(
    (item) => item.stat.name === "special-attack"
  );
  const spDefenseStat = stats.find(
    (item) => item.stat.name === "special-defense"
  );

  const pokemonHtml = `
  <li class="pokemon-card">
    <div class="pokemon-card-image">
      <img src="${
        sprites.front_default
      }" height="200" width="200" alt="pokémon ${name}">
    </div>
    <div class="pokemon-card-content">
      <div class="pokemon-card-heading">
        <h2 class="pokemon-card-title">${name}</h2>
        <span class="pokemon-card-type">${types[0].type.name}</span>
      </div>
      <ul class="pokemon-card-attributes">
        <li class="pokemon-card-attributes-item">
          <span class="pokemon-card-attributes-name">HP</span>
          <div class="pokemon-card-attributes-progress">
            <div class="pokemon-card-attributes-progress-bar" style="width: ${
              (hpStat.base_stat * 100) / 255
            }%"></div>
          </div>
        </li>
        <li class="pokemon-card-attributes-item">
          <span class="pokemon-card-attributes-name">Attack</span>
          <div class="pokemon-card-attributes-progress">
            <div class="pokemon-card-attributes-progress-bar" style="width: ${
              (attackStat.base_stat * 100) / 255
            }%"></div>
          </div>
        </li>
        <li class="pokemon-card-attributes-item">
          <span class="pokemon-card-attributes-name">Defense</span>
          <div class="pokemon-card-attributes-progress">
            <div class="pokemon-card-attributes-progress-bar" style="width: ${
              (defenseStat.base_stat * 100) / 255
            }%"></div>
          </div>
        </li>
        <li class="pokemon-card-attributes-item">
          <span class="pokemon-card-attributes-name">Special Attack</span>
          <div class="pokemon-card-attributes-progress">
            <div class="pokemon-card-attributes-progress-bar" style="width: ${
              (spAttackStat.base_stat * 100) / 255
            }%"></div>
          </div>
        </li>
        </li>
        <li class="pokemon-card-attributes-item">
          <span class="pokemon-card-attributes-name">Special Defense</span>
          <div class="pokemon-card-attributes-progress">
            <div class="pokemon-card-attributes-progress-bar" style="width: ${
              (spDefenseStat.base_stat * 100) / 255
            }%"></div>
          </div>
        </li>
      </ul>
    </div>
  </li>
  `;

  const pokemonListUl = document.querySelector(".pokemon-list");
  pokemonListUl.insertAdjacentHTML("beforeend", pokemonHtml);
}

async function populatePokemons(pokemons) {
  for (const pokemon of pokemons) {
    const { name, types, sprites, stats } = pokemon;
    insertPokemonHtml({ name, types, sprites, stats });
  }
}

function removeAllPokemons() {
  const pokemonListUl = document.querySelector(".pokemon-list");
  pokemonListUl.innerHTML = "";
}

async function handleSearchInput(event, pokemons) {
  const searchEntry = event.target.value;
  const searchResult = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchEntry.toLowerCase())
  );

  removeAllPokemons();
  if (searchResult) {
    await populatePokemons(searchResult);
  }
}

function initSearch(pokemons) {
  const searchInput = document.querySelector(".search input");
  searchInput.addEventListener(
    "change",
    async (event) => await handleSearchInput(event, pokemons)
  );
}

async function handleFilterClick(button, filters, pokemons) {
  let filterResult;
  if (button.dataset.pokemonType === "all") {
    filterResult = pokemons;
  } else {
    filterResult = pokemons.filter(
      (pokemon) => pokemon.types[0].type.name === button.dataset.pokemonType
    );
  }

  filters.forEach((button) => {
    button.classList.remove("active");
  });
  button.classList.add("active");

  removeAllPokemons();
  if (filterResult) {
    await populatePokemons(filterResult);
  }
}

function initFilter(pokemons) {
  const filters = document.querySelectorAll(".filter-button");

  filters.forEach((button) => {
    button.addEventListener(
      "click",
      async () => await handleFilterClick(button, filters, pokemons)
    );
  });
}

async function main() {
  const pokemons = await fetchPokemons();
  populatePokemons(pokemons);
  initSearch(pokemons);
  initFilter(pokemons);
}

main();
