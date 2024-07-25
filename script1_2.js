let startUrl = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
let typeUrl = "https://pokeapi.co/api/v2/pokemon/";
let amount = 0;
let startAmount = 0;
let allPokemons = [];
let filteredPokemons = [];
let inputField;

document.addEventListener('DOMContentLoaded', (event) => {
    init();

    // Event Listener zum Schließen des Popups, wenn außerhalb des pokemonInfoCard geklickt wird
    document.getElementById('cardBackground').addEventListener('click', (event) => {
        // Kontrolle, ob nicht auf die PokemoninfoCard geklickt wurde
        if (!document.getElementById('pokemonInfoCard').contains(event.target)) {
            // Falls alles passt wird diese Aktion durchgeführt
            closePokemonCard();
        }
    });
    // Event Listener zum Verhindern des Schließens, wenn innerhalb des pokemonInfoCard geklickt wird
    document.getElementById('pokemonInfoCard').addEventListener('click', (event) => {
        event.stopPropagation(); // Verhindert das Weiterleiten des Click-Events
    });

     // Event Listener für das Suchfeld
     document.getElementById('searchField').addEventListener('input', readInput);
     readInput();
    });

function init() {
    renderStartPage();
}

function readInput() {
    inputField = document.getElementById('searchField').value; // 'searchField' sollte die ID des Eingabefelds sein
    inputField = inputField.toLowerCase(); // Umwandeln in Kleinbuchstaben
    filterPokemons(inputField);
}

function filterPokemons(inputField) {
    filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(inputField));
    // Alle Pokemons, die durch den Filter kommen, werden im Array gespeichert
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
    await loadMoreButton(pokemons);
}

async function renderMorePokemons(pokemons) {
    let content = document.getElementById('content');
    amount = amount +10;
    for (let i = startAmount; i < amount; i++) {
        pokemon = await loadPokemon(pokemons.results[i].name);
        let name = capitalizeFirstLetter(pokemons.results[i].name); // for Capital letter
        content.innerHTML += renderStartPageHTML(name, i, pokemon);
    }

   addEventListeners(0, amount);
    startAmount = amount;
    
}

function renderStartPageHTML(name, i, pokemon) {
    return `
    <div class="pokemonCards ${pokemon.types[0].type.name}" id="pokemon-${i}">
        <h2 class="pokemonName">${name}</h2>
        <div class="typeAndImg">
           <div>${pokemonType(pokemon)} </div>
           <img class="showAllPokemonImage" src="${pokemon.sprites.other['official-artwork'].front_default}">
        </div>
    </div>`;
}

async function loadMoreButton(pokemons) {
    let main = document.getElementById('main');
    let loadMoreButton = document.createElement('button');
    loadMoreButton.id = 'loadMoreButton';
    loadMoreButton.classList.add('loadMoreButton');
    loadMoreButton.innerText = 'Load More';
    loadMoreButton.addEventListener('click', () => renderMorePokemons(pokemons));
    main.appendChild(loadMoreButton);
}

// Adds an event listener to every card
function addEventListeners(start, end) {
    for (let i = start; i < end; i++) {
        let card = document.getElementById(`pokemon-${i}`);
        if (card) {
            card.addEventListener("click", () => {
                console.log(`Pokemon ${i} clicked`);
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
    // let name = pokemon.results[i].name;
    let name = capitalizeFirstLetter(filteredPokemons[i].name);
    pokemonInfo.innerHTML = openPokemoncardHTML(name, pokemon, i);
    loadAbouts(i);
}

function openPokemoncardHTML(name, pokemon, i) {
    return `
    <div class="infoCardTop">
        <h2 class="infoCardName">${name}</h2>
        <img class="infoCardImg" src="${pokemon.sprites.other['official-artwork'].front_default}">
    </div>
    <div class="infoCardBottom" id="pokemonInfo">
        <div class="infoCardText">
            <div class="infoCardLinks" id="infoCardLinks"> 
                <b class="loadAbouts" onclick="loadAbouts(${i})" id="about">About</b>  
                <b class="loadBasestate" onclick="loadBasestate(${i})" id="basestate">Basestate</b></div>
            <div id="infoContent" class="infoContent"></div>
        </div>
        <div class="swipeButtons"><button id="cardBeforeButton" onclick="openCardBefore(${i})"><b><</b></button> <button onclick="openCardAfter(${i})"><b>></b></button></div>
    </div>`;
}

async function openCardBefore(i) {
    let pokemons = {results: filteredPokemons}; ;
    i = i - 1;
    if (i < 0) {
        i = filteredPokemons.length - 1;
    }
    openPokemoncard(i);
}

async function openCardAfter(i) {
    let pokemons = {results: filteredPokemons}; ;
    i = i + 1;
    if (i >= filteredPokemons.length) {
        i = 0;
    }
    openPokemoncard(i);
}

async function loadAbouts(i) {
    let content = document.getElementById('infoContent');
    content.innerHTML = '';
    let button = document.getElementById('about');
    let buttonBase = document.getElementById('basestate');
    button.classList.add('loadBorder');
    buttonBase.classList.remove('loadBorder');
    let pokemon = await loadPokemon(filteredPokemons[i].name);
    content.innerHTML = loadAboutsHTML(pokemon);
}

function loadAboutsHTML(pokemon) {
    return `
    <span class="loadInfoSpan"><b>Type:</b><span class="typeOnBigView">${pokemonType(pokemon)}</span></span>
    <span class="loadInfoSpan"><b>Height:</b><span> ${pokemon.height}</span></span>
    <span class="loadInfoSpan"><b>Order:</b> <span>${pokemon.order}</span></span>
    <span class="loadInfoSpan"><b>Weight:</b> <span>${pokemon.weight}</span></span> 
    <span class="loadInfoSpan"><b>Base-Experience:</b> <span>${pokemon['base_experience']}</span></span>`;
}

async function loadBasestate(i) {
    let content = document.getElementById('infoContent');
    content.innerHTML = '';
    let button = document.getElementById('about');
    let buttonBase = document.getElementById('basestate');
    button.classList.remove('loadBorder');
    buttonBase.classList.add('loadBorder');
    let pokemon = await loadPokemon(filteredPokemons[i].name);
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
    allPokemons = responseToJson.results; // Hier die allPokemons Liste füllen
    return responseToJson;
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
        // result += ` `;
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

function pokemonStatsHTML(statName, pokemon, i, baseStat) {
    return `
        <span class="statSpan">
            <b>${statName}:</b> 
            <div class="statNumberAndShowLine">
                <b>${pokemon.stats[i]['base_stat']}</b>
                <div class="fullWidth"> 
                    <div class="fullPercent">
                    <span id="showPercent${i}" class="showPercent" style="width: ${baseStat}%;"></span>
                    </div>
                </div>
            </div>
        </span>`;
}
