let next;

function makeRequest(url, method, json) {
    return new Promise((resolve, reject) => {
        // showSpinner();

        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        if (method === 'GET') {
            xhr.send();
        }

        if (method === 'PUT') {
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(json);
        }

        if (method === 'DELETE') {
            xhr.send(null);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }

            if (this.readyState === 4 && this.status === 200) {
                // hideSpinner();
                try {
                    const response = JSON.parse(this.responseText);
                    resolve(response);
                } catch (e) {
                    console.log(e);
                }
            } else {
                // hideSpinner();
                reject(xhr.responseText);
                console.log(xhr.responseText);
            }
        }
    });
}

function showPokemons(pokemons) {
    const pokemonList = document.getElementById('pokemon-catalog');

    next = `${pokemons.next}`;
    pokemons = pokemons.results;
    pokemons.forEach((pokemon) => {

        const column = document.createElement('div');
        column.setAttribute('class', 'column col-md-4');
        pokemonList.appendChild(column);

        const item = document.createElement('div');
        item.setAttribute('class', 'pokemon-catalog__item');
        column.appendChild(item);

        const icon = document.createElement('div');
        icon.setAttribute('class', 'pokemon-catalog__item--icon');
        item.appendChild(icon);

        const pokemonName = document.createElement('h4');
        pokemonName.setAttribute('class', 'pokemon-catalog__item--name');

        const pokemonNameLink = document.createElement('a');
        pokemonNameLink.setAttribute('href', '#');
        pokemonName.appendChild(pokemonNameLink);

        const pokemonNameLinkText = document.createTextNode(`${pokemon.name}`);
        pokemonNameLink.appendChild(pokemonNameLinkText);
        item.appendChild(pokemonName);

        pokemonNameLink.addEventListener('click', showPokemonsDetails);
    });
}

makeRequest('https://pokeapi.co/api/v2/pokemon/?limit=12', 'GET')
    .then(responsePokemonList => {
        showPokemons(responsePokemonList);
        return responsePokemonList;
    })

    .catch(error => console.log(error));


function showMorePokemons() {
    makeRequest(`${next}`, 'GET')
        .then(responsePokemonList => {
            showPokemons(responsePokemonList);
            return responsePokemonList;
        })
}

function showPokemonsDetails(e) {


    let list = document.getElementById("pokemon-card");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    let renddata;
    let stats;
    let pokemonNmae = e.target.textContent.toLowerCase();

    const pokemonList = document.getElementById('pokemon-card');

    makeRequest(`https://pokeapi.co/api/v2/pokemon/${pokemonNmae}/`, 'GET')
        .then(responsePokemonLists => {
            stats = responsePokemonLists.stats;

            const pokemonCard = document.createElement('div');
            pokemonCard.setAttribute('class', 'pokemon-card');
            pokemonList.appendChild(pokemonCard);


            const icon = document.createElement('div');
            icon.setAttribute('class', 'pokemon-card__icon');
            pokemonCard.appendChild(icon);

            const pokemonName = document.createElement('h4');
            pokemonName.setAttribute('class', 'pokemon-card__name');

            const pokemonNameLink = document.createElement('a');
            pokemonNameLink.setAttribute('href', '#');
            pokemonName.appendChild(pokemonNameLink);

            const pokemonNameLinkText = document.createTextNode(` ${responsePokemonLists.name} # ${responsePokemonLists.id.toString()} `);
            pokemonNameLink.appendChild(pokemonNameLinkText);
            pokemonCard.appendChild(pokemonName);

            const listCharacteristics = document.createElement('div');
            listCharacteristics.setAttribute('class', 'list-characteristics');
            pokemonCard.appendChild(listCharacteristics);

            listCharacteristics.innerHTML += `
        
        
            <div class="list-characteristics__item list-characteristics__item d-flex align-justify align-middle">
                <div class="list-characteristics__item--name">
                  Type
                </div>
                <div class="list-characteristics__item--value">
                  Fire  
                </div>
            </div>
        `;

            stats.forEach((stat) => {

                listCharacteristics.innerHTML += `
        
        
            <div class="list-characteristics__item list-characteristics__item d-flex align-justify align-middle">
                <div class="list-characteristics__item--name">
               ${stat.stat.name}
                </div>
                <div class="list-characteristics__item--value">
                    ${stat.base_stat}         
                </div>
            </div>
        `;

            });
            listCharacteristics.innerHTML += `
        
       
            <div class="list-characteristics__item list-characteristics__item d-flex align-justify align-middle">
                <div class="list-characteristics__item--name">
               Weight
                </div>
                <div class="list-characteristics__item--value">
                   ${responsePokemonLists.weight}    
                </div>
            </div>
            <div class="list-characteristics__item list-characteristics__item d-flex align-justify align-middle">
                <div class="list-characteristics__item--name">
               Total moves
                </div>
                <div class="list-characteristics__item--value">
                   ${responsePokemonLists.moves.length}    
                </div>
            </div>
       `;


            return responsePokemonLists;


        })
}

