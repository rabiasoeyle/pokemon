
async function getAllPokemons(){
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0");
    let responseToJsonAll = await response.json();
    i=0;
    let individualUrl = responseToJsonAll['results'][i]['url'];
    return responseToJsonAll, individualUrl;
}

function onloadFunc() {
    loadData();
  }
  
  async function loadData(path = "pokemon/") {
    let response = await fetch(POKEAPI_URL + path);
    let responseToJson = await response.json();
    console.log(responseToJson);
  }
  
  // Die such Function 
  async function searchPokemonName() {
    try {
      let pokemonName = document
        .getElementById("pokemonName")
        .value.toLowerCase();
      let response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/${pokemonName}"
      );
      if (!response.ok) {
        throw new Error("Could not fetch resource");
      }
      pokemonSprite(response);
    } catch (error) {
      console.error(error);
    }
  }
  
  async function pokemonSprite(response) {
    try {
      const data = await response.json();
      const pokemonSprite = data.sprites.front_default;
      const imgElement = document.getElementById("pokemonSprite"); // Die ID muss noch an das Passende HTML Element geändert werden.
      imgElement.src = pokemonSprite;
      imgElement.style.display = "block";
    } catch (error) {
      console.error(error);
    }
  }