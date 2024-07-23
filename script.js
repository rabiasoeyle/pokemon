let startUrl = "https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0";
let typeUrl = "https://pokeapi.co/api/v2/pokemon/";
let amount = 20;

function init(){
    renderStartPage();
}


async function renderStartPage(){
    let content = document.getElementById('content');
    let pokemons = await loadMainPokemonData("results");  
    content.innerHTML ='';
    await renderMorePokemons( pokemons);
    content.innerHTML+= `<button class="loadMoreButton" onclick="renderMorePokemons(pokemons)">Load More</button>`
}


async function renderMorePokemons(pokemons){
    amount = amount + 20;
    for(i=0; i<amount; i ++){
        let pokemon = await loadPokemon(i+1)
        content.innerHTML += renderStartPageHTML(pokemons, i, pokemon);
        // document.getElementById(`pokemon-${i}`).addEventListener("click", openPokemoncard);
        colorOfCard(pokemon, i);
    }
}


function colorOfCard(pokemon, i){
    let content = document.getElementById(`pokemon-${i}`);
    switch(pokemon['types'][0]['type']['name']){
        case "grass": 
            content.classList.add('green');
            break;
        case  "fire":
            content.classList.add('red');
            break;
        case "flying":
            content.classList.add('babyblue');
            break;
        case "poison":
            content.classList.add('purple');
            break;
        case "bug":
            content.classList.add('brightgreen');
            break;
        case "ice":
            content.classList.add('darkwhite');
            break;
        case "ground":
            content.classList.add('brown');
            break;
        case "rock":
            content.classList.add('grey');
            break;
        case "water":
            content.classList.add('blue');
            break;
        case "electric":
            content.classList.add('yellow');
            break;
        case "steel":
            content.classList.add('grey');
            break;
        case "dragon":
            content.classList.add('red');
            break;
        case "fairy":
            content.classList.add('pink');
            break;
        default:
            content.classList.add('normal');
        ; }
}


function renderStartPageHTML(pokemons, i, pokemon){
    return `
    <div  class="pokemonCards" id="pokemon-${i}"  onclick="openPokemoncard(pokemons, i, pokemon)">
        <h2 class="pokemonName">${pokemons['results'][i]['name']}</h2>
        <div class="typeAndImg">
           <div>${pokemonType(pokemon)} </div>
           <img class="showAllPokemonImage"src="${pokemon['sprites']['other']['official-artwork']['front_default']}">
        </div>
    </div>`
} 


function openPokemoncard(pokemons, i, pokemon){
    let popup = document.getElementById('pokemonInfoCardBackground');
    popup.classList.remove('d-none');
    let pokemonInfo = document.getElementById('pokemonInfoCard');
    pokemonInfo.innerHTML = `
    <h2>${pokemons['results'][i]['name']}</h2>
    <div>
        <div>Info: </div>
        <img src="${pokemon['sprites']['other']['official-artwork']['front_default']}>
    </div>`
}


function closePokemonCard(){
    let popup = document.getElementById('pokemonInfoCardBackground');
    popup.classList.add('d-none');
}

async function loadMainPokemonData(path=""){
    let response = await fetch(startUrl + path +".json");
    let responseToJson = await response.json();
    console.log('MainArray: '+ responseToJson);
    console.log(Object.keys(responseToJson))
    return responseToJson;
}


async function loadPokemon(path=""){
    let response = await fetch(typeUrl + path);
    let responseToJson = await response.json();
    console.log('PokemonArray: '+ responseToJson);
    return responseToJson;
}

function pokemonType(pokemon){
    let result='';
    for(i=0; i<pokemon['types'].length; i++){
        result += pokemon['types'][i]['type']['name']
        result += ` `;
    }
    return  result;
}