let startUrl = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
let typeUrl = "https://pokeapi.co/api/v2/pokemon/";
let amount = 0;
let startAmount = 0;
let allPokemons = [];
let filteredPokemons = [];
let inputField;

window.addEventListener("load", ()=> {
        const loader = document.querySelector(".loader");
        loader.classList.add("loader-hidden");
        loader.addEventListener("transitionend", ()=>{
            document.body.removeChild(loader);
})}) 
document.addEventListener('DOMContentLoaded', (event) => {
    init();
document.getElementById('cardBackground').addEventListener('click', (event) => {
    if (!document.getElementById('pokemonInfoCard').contains(event.target)) {
        closePokemonCard();}
});
document.getElementById('pokemonInfoCard').addEventListener('click', (event) => {
    event.stopPropagation();
    });
document.getElementById('searchField').addEventListener('input', readInput);
});

async function init() {
    showLoader();
    await renderStartPage();
    hideLoader();
}

function showLoader() {
    const loader = document.querySelector(".loader");
    loader.classList.remove("loader-hidden");
}

function hideLoader() {
    const loader = document.querySelector(".loader");
    loader.classList.add("loader-hidden");
}

async function readInput() {
    inputField = document.getElementById('searchField').value; // 'searchField' sollte die ID des Eingabefelds sein
    inputField = inputField.toLowerCase(); // Umwandeln in Kleinbuchstaben
    filterPokemons(inputField);
}

function noInput(){
    amount = 0;
    startAmount = 0;
    filteredPokemons=[];
    button.classList.remove('d-none');
    renderStartPage();
}

function inputIsANumber(){
    let inputNumber = parseInt(inputField);
    filteredPokemons = allPokemons.filter(pokemon => pokemon.id === inputNumber);
    button.classList.add('d-none');
}
function inputAvailable(){
    filteredPokemons = allPokemons.filter(pokemon  => pokemon.name.toLowerCase().includes(inputField));
    button.classList.add('d-none');
}

async function filterPokemons(inputField) {
    if (inputField.length === 0 ) {
        noInput();
        return;
    }
    let isNumber = !isNaN(parseInt(inputField))
    if (isNumber) {
        inputIsANumber();
    }else if (inputField.length >= 3 ) {
        inputAvailable();
    }else{
        return; }
    amount = 0;
    startAmount = 0;
    document.getElementById('content').innerHTML = '';
    renderMorePokemons({results: filteredPokemons}); // Hier die gefilterte Liste anzeigen
}

async function renderStartPage() {
    let content = document.getElementById('content');
    let pokemons = await loadMainPokemonData();
    filteredPokemons = allPokemons;
    content.innerHTML = '';
    await renderMorePokemons(pokemons);
    let button = document.getElementById('loadMoreButton');
    if(button && filteredPokemons.length != 151){
        button.classList.add('d-none');
    }
    if(!button){
        await loadMoreButton(pokemons);
    }
}

async function renderMorePokemons(pokemons) {
    showLoader();
    let loadMoreButton = document.getElementById('loadMoreButton');
    if (loadMoreButton) {
        loadMoreButton.disabled = true; // Button deaktivieren
    }
    amount = amount +10;
    await renderMorePokemonsForLoop(pokemons);
    addEventListeners(0, amount);
    startAmount = amount;
    if (loadMoreButton) {
        loadMoreButton.disabled = false; // Button wieder aktivieren
    }
    hideLoader();
}

async function renderMorePokemonsForLoop(pokemons){
    let content = document.getElementById('content');
    for (let i = startAmount; i < amount; i++) {
        if (i >= pokemons.results.length) break;
        let pokemon = await loadPokemon(pokemons.results[i].name);
        let name = capitalizeFirstLetter(pokemons.results[i].name); // for Capital letter
        content.innerHTML += renderStartPageHTML(name, i, pokemon);
    } 
}

async function loadMoreButton(pokemons) {
    let main = document.getElementById('button');
    let loadMoreButton = document.createElement('button');
    loadMoreButton.id = 'loadMoreButton';
    loadMoreButton.classList.add('loadMoreButton');
    loadMoreButton.innerText = 'Load More';
    main.appendChild(loadMoreButton);
    loadMoreButton.addEventListener('click', () => renderMorePokemons(pokemons));
}

// Adds an event listener to every card
function addEventListeners(start, end) {
    for (let i = start; i < end; i++) {
        let card = document.getElementById(`pokemon-${i}`);
        if (card) {
            card.addEventListener("click", () => {
                openPokemoncard(i);
            });
        }
    }
}

// Opens one detailed Infocard of a pokemon which was clicked on
async function openPokemoncard(i) {
    let pokemon = await loadPokemon(filteredPokemons[i].name);
    let popup = document.getElementById('cardBackground');
    popup.classList.remove('d-none');
    popup.classList.add('d-flex');
    let pokemonInfo = document.getElementById('pokemonInfoCard');
    pokemonInfo.innerHTML = '';
    let name = capitalizeFirstLetter(filteredPokemons[i].name);
    pokemonInfo.innerHTML = openPokemoncardHTML(name, pokemon, i);
    let swipeButtons = document.getElementById(`swipeButtons${i}`);
    if(filteredPokemons.length != 151){
        swipeButtons.classList.add('d-none');
    }else{
        swipeButtons.classList.remove('d-none');
    }
    if(name == "Pikachu"){
        playSound(pokemon);  
    }loadAbouts(i);

}

function playSound(pokemon){
    let audio = new Audio (`${pokemon.cries.latest}`);
    audio.play();
}

async function openCardBefore(i) {
    i =  i - 1;
    if (i < 0) {
        i = filteredPokemons.length - 1;
    }
    openPokemoncard(i);
}

async function openCardAfter(i) {
    i = i + 1;
    if (i >= filteredPokemons.length) {
        i = 0;
    }
    openPokemoncard(i);
}

async function loadAbouts(i) {
    let pokemon = await loadPokemon(filteredPokemons[i].name);
    let content = document.getElementById('infoContent');
    content.innerHTML = '';
    let button = document.getElementById('about');
    let buttonBase = document.getElementById('basestate');
    button.classList.add(`${pokemon.types[0].type.name}`);
    button.classList.add('loadBorder');
    buttonBase.classList.remove('loadBorder');
    buttonBase.classList.remove(`${pokemon.types[0].type.name}`);
    content.innerHTML = loadAboutsHTML(pokemon);
}

async function loadBasestate(i) {
    let pokemon = await loadPokemon(filteredPokemons[i].name);
    let content = document.getElementById('infoContent');
    content.innerHTML = '';
    let button = document.getElementById('about');
    let buttonBase = document.getElementById('basestate');
    button.classList.remove(`${pokemon.types[0].type.name}`);
    button.classList.remove('loadBorder');
    buttonBase.classList.add(`${pokemon.types[0].type.name}`);
    buttonBase.classList.add('loadBorder');
    content.innerHTML = pokemonStats(pokemon);
}

// For capitalising the first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function closePokemonCard() {
    let popup = document.getElementById('cardBackground');
    popup.classList.add('d-none');
    popup.classList.remove('d-flex');
}

async function loadMainPokemonData() {
    let response = await fetch(startUrl);
    let responseToJson = await response.json();
    allPokemons = responseToJson.results.map((pokemon, index) => ({
        name: pokemon.name,
        url: pokemon.url,
        id: index + 1 // Die ID wird hier basierend auf dem Index gesetzt, da die ersten 151 Pokémon geladen werden
    }));
    return {results: allPokemons};
}

async function loadPokemon(path) {
    let response = await fetch(typeUrl + path);
    let responseToJson = await response.json();
    return responseToJson;
}

function pokemonType(pokemon) {
    let result = '';
    for (let i = 0; i < pokemon.types.length; i++) {
        result += `<div class="typeDiv ${pokemon.types[i].type.name}">${pokemon.types[i].type.name}</div>`;
    } 
    return result;
}

function pokemonStats(pokemon) {
    let result = '';
    for (let i = 0; i < pokemon.stats.length; i++) {
        let statName = pokemon.stats[i].stat.name;
        statName = capitalizeFirstLetter(statName);
        let baseStat = pokemon.stats[i]['base_stat'];
        result += pokemonStatsHTML(statName, pokemon, i, baseStat);
    }
    return result;
}

