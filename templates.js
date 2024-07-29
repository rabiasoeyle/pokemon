function renderStartPageHTML(name, i, pokemon) {
    return `
        <div class="pokemonCards ${pokemon.types[0].type.name}" id="pokemon-${i}">
            <div class="idAndName">
                <span class="idSpan">no.${pokemon.id}</span>
                <h3 class="pokemonName">${name}</h3>
            </div>
            <div class="typeAndImg">
            <div class="allTypesDiv">${pokemonType(pokemon)} </div>
            <img class="showAllPokemonImage" src="${pokemon.sprites.other['official-artwork'].front_default}">
            </div>
        </div>`;
}

function openPokemoncardHTML(name, pokemon, i) {
    return `
        <div class="infoCardTop ${pokemon.types[0].type.name}">
            <h2 class="infoCardName">${name}</h2>
            <img class="infoCardImg" src="${pokemon.sprites.other['official-artwork']['front_default']}">
        </div>
        <div class="infoCardBottom" id="pokemonInfo">
            <div class="infoCardLinks" id="infoCardLinks"> 
                <b class="loadAbouts" onclick="loadAbouts(${i})" id="about">About</b>  
                <b class="loadBasestate" onclick="loadBasestate(${i})" id="basestate">Basestate</b>
            </div>
            <div class="infoCardText"> 
                <div id="infoContent" class="infoContent"></div>
            </div>
            <div class="swipeButtons" id="swipeButtons${i}">
                <button id="cardBeforeButton" onclick="openCardBefore(${i})" class="${pokemon.types[0].type.name}">
                    <b><</b>
                </button> 
                <button onclick="openCardAfter(${i})" class="${pokemon.types[0].type.name}">
                    <b>></b>
                </button>
            </div>
        </div>`;
    
}

function loadAboutsHTML(pokemon) {
    return `
        <span class="loadInfoSpan"> 
            <b>Type:</b> 
            <span class="typeOnBigView">${pokemonType(pokemon)}</span> 
        </span>
        <span class="loadInfoSpan">
            <b>Height:</b>
            <span> ${pokemon.height}</span>
        </span>
        <span class="loadInfoSpan">
            <b>Order:</b> 
            <span>${pokemon.order}</span>
        </span>
        <span class="loadInfoSpan">
            <b>Weight:</b> 
            <span>${pokemon.weight}</span>
        </span> 
        <span class="loadInfoSpan">
            <b>Base-Experience:</b> 
            <span>${pokemon['base_experience']}</span>
        </span>`;
}

//wird ausgeführt nachdem man auf loadBasestate klickt
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