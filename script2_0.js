function init(){
    renderPokemonCards();
}

async function renderPokemonCards(){
let content= document.getElementById('content');
let pokemons = await getAllPokemons();

}


async function getAllPokemons(){
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0");
    let responseToJsonAll = await response.json();
    i=0;
    let individualUrl = responseToJsonAll['results'][i]['url'];
    return responseToJsonAll, individualUrl;
}