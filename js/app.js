const apiURL = 'https://pokeapi.co/api/v2/pokemon/';

const pokemonImage = document.getElementById('pokemon-image');
const mainScreen = document.querySelector('.main-screen');
const loadingText = document.getElementById('loading-text');
const infoScreen = document.getElementById('info-screen');
const upBtn = document.querySelector('.cross-key.up');
const downBtn = document.querySelector('.cross-key.down');
const leftBtn = document.querySelector('.cross-key.left');
const rightBtn = document.querySelector('.cross-key.right');
const blueKeys = document.querySelectorAll('.blue-key');

const generations = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 },
    4: { start: 387, end: 493 },
    5: { start: 494, end: 649 },
    6: { start: 650, end: 721 },
    7: { start: 722, end: 809 },
    8: { start: 810, end: 905 },
    9: { start: 906, end: 1025 }
};

let currentGen = 1;
let currentPokemonId = 1;
let minId = 1;
let maxId = 151;

// Language Logic
let currentLang = localStorage.getItem('pokedex_lang') || 'es';

const translations = {
    es: {
        types: {
            normal: 'Normal', fire: 'Fuego', water: 'Agua', grass: 'Planta', electric: 'Eléctrico',
            ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno', ground: 'Tierra', flying: 'Volador',
            psychic: 'Psíquico', bug: 'Bicho', rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón',
            steel: 'Acero', dark: 'Siniestro', fairy: 'Hada'
        },
        stats: {
            hp: { label: 'PS', name: 'Puntos de Salud' },
            attack: { label: 'ATQ', name: 'Ataque' },
            defense: { label: 'DEF', name: 'Defensa' },
            'special-attack': { label: 'ESP', name: 'Ataque Especial' },
            'special-defense': { label: 'ESD', name: 'Defensa Especial' },
            speed: { label: 'VEL', name: 'Velocidad' }
        },
        ui: {
            loading: 'Buscando...',
            analyzing: 'Analizando...',
            error: '¡Error!',
            corruption: 'Datos Corruptos.',
            height: 'ALT',
            weight: 'PES',
            type: 'TIPO',
            exit: 'SALIR',
            info: 'INFO'
        },
        modal: {
            abilities: 'Habilidades',
            stats: 'Estadísticas',
            description: 'Descripción',
            normal: 'Normal',
            shiny: 'Variocolor',
            hidden: ' (Oculta)'
        }
    },
    en: {
        types: {
            normal: 'Normal', fire: 'Fire', water: 'Water', grass: 'Grass', electric: 'Electric',
            ice: 'Ice', fighting: 'Fighting', poison: 'Poison', ground: 'Ground', flying: 'Flying',
            psychic: 'Psychic', bug: 'Bug', rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon',
            steel: 'Steel', dark: 'Dark', fairy: 'Fairy'
        },
        stats: {
            hp: { label: 'HP', name: 'Hit Points' },
            attack: { label: 'ATK', name: 'Attack' },
            defense: { label: 'DEF', name: 'Defense' },
            'special-attack': { label: 'SPA', name: 'Special Attack' },
            'special-defense': { label: 'SPD', name: 'Special Defense' },
            speed: { label: 'SPD', name: 'Speed' }
        },
        ui: {
            loading: 'Searching...',
            analyzing: 'Analyzing...',
            error: 'Error!',
            corruption: 'Data Corruption.',
            height: 'HT',
            weight: 'WT',
            type: 'TYPE',
            exit: 'EXIT',
            info: 'INFO'
        },
        modal: {
            abilities: 'Abilities',
            stats: 'Stats',
            description: 'Description',
            normal: 'Normal',
            shiny: 'Shiny',
            hidden: ' (Hidden)'
        }
    },
    fr: {
        types: {
            normal: 'Normal', fire: 'Feu', water: 'Eau', grass: 'Plante', electric: 'Électrik',
            ice: 'Glace', fighting: 'Combat', poison: 'Poison', ground: 'Sol', flying: 'Vol',
            psychic: 'Psy', bug: 'Insecte', rock: 'Roche', ghost: 'Spectre', dragon: 'Dragon',
            steel: 'Acier', dark: 'Ténèbres', fairy: 'Fée'
        },
        stats: {
            hp: { label: 'PV', name: 'Points de Vie' },
            attack: { label: 'ATQ', name: 'Attaque' },
            defense: { label: 'DÉF', name: 'Défense' },
            'special-attack': { label: 'ATQS', name: 'Attaque Spéciale' },
            'special-defense': { label: 'DÉFS', name: 'Défense Spéciale' },
            speed: { label: 'VIT', name: 'Vitesse' }
        },
        ui: {
            loading: 'Recherche...',
            analyzing: 'Analyse...',
            error: 'Erreur!',
            corruption: 'Données Corrompues.',
            height: 'Taille',
            weight: 'Poids',
            type: 'TYPE',
            exit: 'SORTIR',
            info: 'INFO'
        },
        modal: {
            abilities: 'Talents',
            stats: 'Statistiques',
            description: 'Description',
            normal: 'Normal',
            shiny: 'Chromatique',
            hidden: ' (Caché)'
        }
    }
};

// Initialize
async function init() {
    // Parse URL params
    const urlParams = new URLSearchParams(window.location.search);
    const genParam = parseInt(urlParams.get('gen'));

    if (genParam && generations[genParam]) {
        currentGen = genParam;
        minId = generations[currentGen].start;
        maxId = generations[currentGen].end;
        currentPokemonId = minId;
    }

    await loadPokemon(currentPokemonId);

    // Setup D-Pad
    rightBtn.addEventListener('click', () => {
        if (currentPokemonId < maxId) {
            currentPokemonId++;
            loadPokemon(currentPokemonId);
        }
    });

    leftBtn.addEventListener('click', () => {
        if (currentPokemonId > minId) {
            currentPokemonId--;
            loadPokemon(currentPokemonId);
        }
    });

    upBtn.addEventListener('click', () => {
        if (currentPokemonId + 10 <= maxId) {
            currentPokemonId += 10;
        } else {
            currentPokemonId = maxId;
        }
        loadPokemon(currentPokemonId);
    });

    downBtn.addEventListener('click', () => {
        if (currentPokemonId - 10 >= minId) {
            currentPokemonId -= 10;
        } else {
            currentPokemonId = minId;
        }
        loadPokemon(currentPokemonId);
    });

    // Setup Blue Keys - Jump to percentage of gen
    // NOTE: This logic might conflict with stats display listeners if we don't clear them carefully.
    // However, since we replace buttons in displayPokemon, this initial listener setup is effectively
    // only valid until the first Pokemon loads.

    blueKeys.forEach((key, index) => {
        key.addEventListener('click', () => {
            const range = maxId - minId;
            const percent = (index) / 10; // 0.0 to 0.9
            const jump = Math.floor(range * percent);
            let target = minId + jump;
            if (target > maxId) target = maxId;
            if (target < minId) target = minId;

            currentPokemonId = target;
            loadPokemon(currentPokemonId);
        });
    });
}

async function loadPokemon(id) {
    // UI Loading State
    const ui = translations[currentLang].ui;
    mainScreen.classList.remove('on');
    pokemonImage.style.display = 'none';
    loadingText.style.display = 'block';
    loadingText.textContent = ui.loading;
    infoScreen.innerHTML = ui.analyzing;

    try {
        const response = await fetch(`${apiURL}${id}`);
        const data = await response.json();

        // Fetch Species data for flavor text
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        let description = "No description available.";
        // Tries to find entry in current language, fallbacks to English
        const entry = speciesData.flavor_text_entries.find(entry => entry.language.name === currentLang);
        const fallbackEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');

        if (entry) description = entry.flavor_text.replace(/\f/g, ' ');
        else if (fallbackEntry) description = fallbackEntry.flavor_text.replace(/\f/g, ' ');

        displayPokemon(data, description);
    } catch (error) {
        console.error('Error fetching pokemon:', error);
        loadingText.textContent = ui.error;
        infoScreen.textContent = ui.corruption;
    }
}

function displayPokemon(data, description) {
    // Turn screen "on"
    mainScreen.classList.add('on');
    loadingText.style.display = 'none';

    // Set Image
    // Use official artwork or pixel sprite? Front_default is pixel sprite. 'official-artwork' is high res.
    const officialArt = data.sprites.other['official-artwork'].front_default;
    const dreamWorld = data.sprites.other.dream_world.front_default;
    const defaultSprite = data.sprites.front_default;

    if (officialArt) {
        pokemonImage.src = officialArt;
    } else if (dreamWorld) {
        pokemonImage.src = dreamWorld;
    } else {
        pokemonImage.src = defaultSprite || '';
    }

    pokemonImage.style.display = 'block';

    // Set Info
    const name = data.name.toUpperCase();
    const id = data.id.toString().padStart(3, '0');
    const types = data.types.map(t => t.type.name).join('/').toUpperCase();
    const height = data.height / 10; // dm to m
    const weight = data.weight / 10; // hg to kg

    infoScreen.innerHTML = `
        <div style="margin-bottom: 5px; color: #fff;">#${id} ${name}</div>
        <div style="margin-bottom: 5px; color: #FAAE58;">TYPE: ${types}</div>
        <div style="margin-bottom: 5px;">HT: ${height}m</div>
        <div style="margin-bottom: 5px;">WT: ${weight}kg</div>
        <div style="margin-top: 10px; font-size: 8px; color: #ccc;">${description}</div>
    `;

    // Update Green Scouter Marquee
    const scrollingText = document.querySelector('.scrolling-text');
    if (scrollingText) {
        // Just one instance. The marquee animation loops it. 
        // If we want seamless loop, we might need duplication via CSS or duplicate content.
        // But for "entering screen" style, one instance with padding-left: 100% works.
        scrollingText.innerText = `#${id} ${name}`;
    }

    const miniScreens = document.querySelectorAll('.mini-screen');

    // Display Stats in Blue Keys
    // Order: HP, Atk, Def, SpA, SpD, Spd
    const statMap = {
        'hp': { label: 'PS', name: 'Puntos de Salud' },
        'attack': { label: 'ATQ', name: 'Ataque' },
        'defense': { label: 'DEF', name: 'Defensa' },
        'special-attack': { label: 'ESP', name: 'Ataque Especial' },
        'special-defense': { label: 'ESD', name: 'Defensa Especial' },
        'speed': { label: 'VEL', name: 'Velocidad' }
    };

    // Helper to clear listeners by cloning
    // Must query current keys from DOM because we replace them
    const currentKeys = document.querySelectorAll('.blue-key');

    currentKeys.forEach((key) => {
        const newKey = key.cloneNode(true);
        if (key.parentNode) {
            key.parentNode.replaceChild(newKey, key);
        }
    });

    // Re-select the freshly created keys
    const newBlueKeys = document.querySelectorAll('.blue-key');

    data.stats.forEach((stat, index) => {
        if (index < newBlueKeys.length) {
            const info = statMap[stat.stat.name] || { label: 'UNK', name: 'Desconocido' };
            const key = newBlueKeys[index];

            key.innerText = info.label;
            key.title = info.name; // Tooltip

            key.addEventListener('click', () => {
                miniScreens[0].innerText = info.name; // Left screen: Full Name
                miniScreens[1].innerText = stat.base_stat; // Right screen: Value
            });
        }
    });

    // Info Modal Logic
    const infoModal = document.getElementById('info-modal');
    const closeBtn = document.querySelector('.close-btn');
    const infoBtn = document.querySelector('.option-buttons .white-btn:nth-child(2)'); // Second white button

    // Modal Elements
    const modalTitle = document.getElementById('modal-title');
    const modalImgNormal = document.getElementById('modal-img-normal');
    const modalImgShiny = document.getElementById('modal-img-shiny');
    const modalAbilities = document.getElementById('modal-abilities');
    const modalStats = document.getElementById('modal-stats');
    const modalDescription = document.getElementById('modal-description');

    // Open Modal
    // Re-query the button to ensure we have the current one in DOM
    const currentInfoBtn = document.querySelector('.option-buttons .white-btn:nth-child(2)');

    if (currentInfoBtn) {
        const newInfoBtn = currentInfoBtn.cloneNode(true);
        currentInfoBtn.parentNode.replaceChild(newInfoBtn, currentInfoBtn);

        newInfoBtn.addEventListener('click', async () => {
            const t = translations[currentLang];
            modalTitle.textContent = `#${id} ${name}`;

            // Images
            const officialArt = data.sprites.other['official-artwork'].front_default;
            const shinyArt = data.sprites.other['official-artwork'].front_shiny || data.sprites.front_shiny;

            modalImgNormal.src = officialArt || data.sprites.front_default || '';
            modalImgShiny.src = shinyArt || '';

            // Translate Modal Headers/Labels
            const headers = document.querySelectorAll('.detail-section h3');
            if (headers[0]) headers[0].textContent = t.modal.abilities;
            if (headers[1]) headers[1].textContent = t.modal.stats;
            if (headers[2]) headers[2].textContent = t.modal.description;

            const imgLabels = document.querySelectorAll('.img-container p');
            if (imgLabels[0]) imgLabels[0].textContent = t.modal.normal;
            if (imgLabels[1]) imgLabels[1].textContent = t.modal.shiny;

            // Abilities (Fetch Localized)
            modalAbilities.textContent = t.ui.loading; // Show loading

            try {
                const abilityPromises = data.abilities.map(async (a) => {
                    const abResponse = await fetch(a.ability.url);
                    const abData = await abResponse.json();
                    const nameEntry = abData.names.find(n => n.language.name === currentLang);
                    const fallbackEntry = abData.names.find(n => n.language.name === 'en');
                    const abilityName = nameEntry ? nameEntry.name : (fallbackEntry ? fallbackEntry.name : a.ability.name);
                    return `${abilityName}${a.is_hidden ? t.modal.hidden : ''}`;
                });

                const abilityNames = await Promise.all(abilityPromises);
                modalAbilities.textContent = abilityNames.join(', ');
            } catch (err) {
                console.error(err);
                modalAbilities.textContent = "Error loading abilities";
            }

            // Stats Listing
            modalStats.innerHTML = '';
            const statMap = t.stats;
            data.stats.forEach(stat => {
                const li = document.createElement('li');
                const statKey = stat.stat.name;
                const statName = statMap[statKey] ? statMap[statKey].label : statKey; // Use label or name
                li.textContent = `${statName}: ${stat.base_stat}`;
                modalStats.appendChild(li);
            });

            modalDescription.textContent = description;

            infoModal.style.display = 'flex';
        });

        // Close Modal Logic
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

        newCloseBtn.addEventListener('click', () => {
            infoModal.style.display = 'none';
        });

        // Close on outside click
        window.onclick = function (event) {
            if (event.target == infoModal) {
                infoModal.style.display = 'none';
            }
        }
    }
}

init();
