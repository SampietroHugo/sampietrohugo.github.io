document.addEventListener("DOMContentLoaded", () => {
    const pokeContainer = document.getElementById('poke-container');
    const totalCountEl = document.getElementById('total-count');
    const shinyCountEl = document.getElementById('shiny-count');
    const tradeCountEl = document.getElementById('trade-count');
    const teamCountEl = document.getElementById('team-count');
    const gameListContainer = document.getElementById('game-list-container');
    const gameFilterBtn = document.getElementById('game-filter-btn');
    const dropdown = document.getElementById('game-filter-dropdown');
    const filterButtons = document.querySelectorAll('.pokedex-filter-btn[data-filter]');
    const searchBar = document.getElementById('pokedex-search');
    const customModal = document.getElementById('pokemon-detail-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalNavPrev = document.getElementById('modal-nav-prev');
    const modalNavNext = document.getElementById('modal-nav-next');
    const typeFilterBtn = document.getElementById('type-filter-btn');
    const typeListContainer = document.getElementById('type-list-container');

    const memoArrows = document.querySelectorAll('.memo-arrow');
    const memoTitle = document.getElementById('memo-toggle-title');
    const memoSectionCatch = document.getElementById('memo-section-catch');
    const memoSectionInfo = document.getElementById('memo-section-info');
    const memoSectionShiny = document.getElementById('memo-section-shiny-hunt');

    let allPokemons = [];
    let currentPokemonList = [];
    let currentPokemonIndex = 0;

    let memoState = 0;

    let currentFilters = {
        status: 'all',
        game: 'all',
        search: '',
        type: []
    };

    async function initializePokedex() {
        try {
            const response = await fetch('/json/hackdex.json');
            if (!response.ok) throw new Error();

            const data = await response.json();

            allPokemons = data.pokemons.sort((a, b) => {
                const numA = parseInt(a.number.replace('#', ''), 10);
                const numB = parseInt(b.number.replace('#', ''), 10);
                return numA - numB;
            });

            allPokemons.forEach((p, i) => p.arrayIndex = i);

            updateCounts(allPokemons);
            populateGameFilter(allPokemons);
            populateTypeFilter();
            setupEventListeners();
            renderPokemonGrid(allPokemons);
        } catch {
            pokeContainer.innerHTML = "<p class='text-white col-12 text-center'>Error loading Pokédex data.</p>";
        }
    }

    function renderPokemonGrid(list) {
        currentPokemonList = list;
        pokeContainer.classList.add("fade-out");

        setTimeout(() => {
            pokeContainer.innerHTML = "";

            if (list.length === 0) {
                pokeContainer.innerHTML = `
                    <div class="col-12 pokedex-no-results">
                        <img src="./img/structure/gifs/confused.gif" class="no-results-gif">
                        <p>No Pokémon found for this filter.</p>
                    </div>
                `;
            } else {
                list.forEach(p => pokeContainer.appendChild(createPokemonCard(p)));
            }

            pokeContainer.classList.remove("fade-out");
        }, 300);
    }

    function createPokemonCard(pokemon) {
        const col = document.createElement("div");
        col.className = "col";

        const card = document.createElement("div");
        card.className = "pokedex-card";
        card.dataset.id = pokemon.arrayIndex;

        const types = Array.isArray(pokemon.type) ? pokemon.type : [pokemon.type];
        if (types[0]) card.classList.add(`pokedex-card-${types[0].toLowerCase()}`);
        if (pokemon.shiny) card.classList.add("pokedex-card-shiny");
        if (pokemon.trade) card.classList.add("pokedex-card-trade");

        let altIcon = "";
        let altImage = "";

        if (pokemon.altForm) {
            altIcon = `
                <div class="pokedex-card-alt-icon" title="${pokemon.altForm.tooltip}">
                    <img src="${pokemon.altForm.icon}">
                </div>
            `;
            altImage = `
                <img src="${pokemon.altForm.sprite}" class="pokedex-card-image pokedex-card-image-alt hackdex-sprite-enhanced">
            `;
        }

        const shinyTradeIcons = `
            <div class="pokedex-card-image-icon-container">
                ${pokemon.shiny ? `<span class="pokedex-card-icon pokedex-card-icon-shiny"></span>` : ""}
                ${pokemon.trade ? `<span class="pokedex-card-icon pokedex-card-icon-trade"></span>` : ""}
            </div>
        `;

        card.innerHTML = `
            <div class="pokedex-card-image-wrapper">
                <img src="${pokemon.image}" class="pokedex-card-image pokedex-card-image-default hackdex-sprite-enhanced">
                ${altImage}
                ${shinyTradeIcons}
                ${altIcon}
            </div>
            <div class="pokedex-card-info">
                <p class="pokedex-card-name">${pokemon.name}</p>
                <p class="info-detail"><strong>${pokemon.number}</strong></p>
            </div>
        `;

        col.appendChild(card);
        return col;
    }

    function toggleMemoSection() {
        const pokemon = currentPokemonList[currentPokemonIndex];
        const hasShinyHunt = pokemon?.shiny && pokemon?.shinyHunt;

        memoState++;

        if (memoState === 2 && !hasShinyHunt) memoState = 0;
        if (memoState > 2) memoState = 0;

        memoSectionCatch.classList.add("d-none");
        memoSectionInfo.classList.add("d-none");
        memoSectionShiny.classList.add("d-none");

        if (memoState === 0) {
            memoTitle.innerText = "Catch Info";
            memoSectionCatch.classList.remove("d-none");
        } else if (memoState === 1) {
            memoTitle.innerText = "Pokémon Info";
            memoSectionInfo.classList.remove("d-none");
        } else {
            memoTitle.innerText = "Shiny Hunt Info";
            memoSectionShiny.classList.remove("d-none");
        }
    }

    function openPokemonModal(pokemon) {
        memoState = 0;

        const modalName = document.getElementById("modal-pokemon-name");
        const modalNumber = document.getElementById("modal-pokemon-number");
        const modalImage = document.getElementById("modal-pokemon-image");
        const modalEntry = document.getElementById("modal-pokemon-entry");
        const modalSpecies = document.getElementById("modal-pokemon-species");
        const modalTypeContainer = document.getElementById("modal-type-container");
        const modalIconContainer = document.getElementById("modal-icon-container");
        const modalAltFormContainer = document.getElementById("modal-alt-form-container");

        memoTitle.innerText = "Catch Info";
        memoSectionCatch.classList.remove("d-none");
        memoSectionInfo.classList.add("d-none");
        memoSectionShiny.classList.add("d-none");

        modalNumber.textContent = pokemon.number;
        modalImage.src = pokemon.image;
        modalIconContainer.innerHTML = "";
        modalTypeContainer.innerHTML = "";
        modalAltFormContainer.innerHTML = "";
        modalEntry.textContent = pokemon.pokedexEntry ?? "";
        modalSpecies.textContent = pokemon.species ?? "";

        const oldSparkle = modalName.querySelector(".shiny-sparkle");
        if (oldSparkle) oldSparkle.remove();

        modalName.textContent = pokemon.name;

        if (pokemon.shiny) {
            const sparkle = document.createElement("span");
            sparkle.className = "shiny-sparkle";
            sparkle.textContent = "✨";
            modalName.appendChild(sparkle);
        }

        const modalBall = document.getElementById("modal-info-ball");
        if (pokemon.captureInfo?.ball) {
            modalBall.src = pokemon.captureInfo.ball;
            modalBall.style.display = "inline-block";
        } else {
            modalBall.style.display = "none";
        }

        const types = Array.isArray(pokemon.type) ? pokemon.type : [pokemon.type];
        types.forEach(t => {
            modalTypeContainer.innerHTML += `<span class="modal-type-badge pokedex-card-${t.toLowerCase()}">${t}</span>`;
        });

        const cap = pokemon.captureInfo ?? {};

        document.getElementById("modal-info-game").textContent = pokemon.game ?? "???";
        document.getElementById("modal-info-location").textContent = cap.location ?? "???";
        document.getElementById("modal-info-level").textContent = cap.level ? `Lv. ${cap.level}` : "???";
        document.getElementById("modal-info-date").textContent = cap.date ?? "???";
        document.getElementById("modal-info-nature").textContent = cap.nature ?? "???";
        document.getElementById("modal-info-ot").textContent = cap.ot ?? "???";

        let gender = cap.gender;
        document.getElementById("modal-info-gender").textContent =
            gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "???";

        document.getElementById("modal-info-ability").textContent =
            cap.ability ?? pokemon.ability ?? "???";

        if (pokemon.shiny && pokemon.shinyHunt) {
            const hunt = pokemon.shinyHunt;

            document.getElementById("modal-shiny-method").textContent = hunt.method ?? "???";
            document.getElementById("modal-shiny-target").textContent = hunt.targetPokemon ?? pokemon.name;
            document.getElementById("modal-shiny-start").textContent = hunt.startDate ?? "???";
            document.getElementById("modal-shiny-end").textContent = hunt.endDate ?? "???";
            document.getElementById("modal-shiny-encounters").textContent =
                hunt.totalEncounters?.toLocaleString() ?? "???";

            const phasesEl = document.getElementById("modal-shiny-phases");

            if (hunt.phases && String(hunt.phases).trim() !== "") {
                phasesEl.textContent = hunt.phases;
            } else {
                phasesEl.textContent = "???";
            }
        }
    }

    function updateCounts(list) {
        totalCountEl.textContent = `Total: ${list.length}`;
        shinyCountEl.textContent = `Shiny: ${list.filter(p => p.shiny).length}`;
        tradeCountEl.textContent = `Traded: ${list.filter(p => p.trade).length}`;
        teamCountEl.textContent = `Team: ${list.filter(p => p.team).length}`;
    }

    function populateGameFilter(list) {
        gameListContainer.innerHTML = "";

        const order = ["Emerald", "Leaf Green", "Fire Red", "Sapphire", "Ruby"];
        const games = [...new Set(list.map(p => p.game))];

        games.sort((a, b) => {
            const ia = order.indexOf(a);
            const ib = order.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.localeCompare(b);
        });

        games.forEach(game => {
            const g = document.createElement("p");
            g.className = "pokedex-dropdown-item";
            g.textContent = game;
            g.dataset.game = game;
            gameListContainer.appendChild(g);
        });
    }

    function populateTypeFilter() {
        const types = [
            "Normal", "Fire", "Water", "Grass", "Electric", "Ice",
            "Fighting", "Poison", "Ground", "Flying", "Psychic",
            "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"
        ];

        typeListContainer.innerHTML = "";
        const grid = document.createElement("div");
        grid.className = "type-grid";

        types.forEach(type => {
            const label = document.createElement("label");
            label.classList.add(`pokedex-card-${type.toLowerCase()}`);
            label.innerHTML = `<input type="checkbox" value="${type.toLowerCase()}"> ${type}`;
            grid.appendChild(label);
        });

        typeListContainer.appendChild(grid);
    }

    function applyFilters() {
        let list = [...allPokemons];

        if (currentFilters.status !== "all")
            list = list.filter(p => p[currentFilters.status]);

        if (currentFilters.game !== "all")
            list = list.filter(p => p.game === currentFilters.game);

        if (currentFilters.type.length)
            list = list.filter(p =>
                (Array.isArray(p.type) ? p.type : [p.type])
                    .map(t => t.toLowerCase())
                    .some(t => currentFilters.type.includes(t))
            );

        if (currentFilters.search) {
            const term = currentFilters.search;
            list = list.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.number.replace("#", "").includes(term)
            );
        }

        renderPokemonGrid(list);
        updateCounts(list);
    }

    function updateModalNavigation() {
        modalNavPrev.disabled = currentPokemonIndex === 0;
        modalNavNext.disabled = currentPokemonIndex === currentPokemonList.length - 1;
    }

    function navigateModal(dir) {
        const index = currentPokemonIndex + dir;
        if (index < 0 || index >= currentPokemonList.length) return;
        currentPokemonIndex = index;
        openPokemonModal(currentPokemonList[index]);
        updateModalNavigation();
    }

    function setupEventListeners() {
        memoArrows.forEach(a => a.addEventListener("click", toggleMemoSection));

        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const f = btn.dataset.filter;

                if (f === "all") {
                    currentFilters = { status: "all", game: "all", search: "", type: [] };
                    searchBar.value = "";
                    gameFilterBtn.textContent = "Games ▼";
                    typeFilterBtn.textContent = "Type ▼";
                    typeListContainer.querySelectorAll("input").forEach(c => c.checked = false);
                } else currentFilters.status = f;

                applyFilters();
            });
        });

        gameListContainer.addEventListener("click", e => {
            const item = e.target.closest(".pokedex-dropdown-item");
            if (!item) return;
            currentFilters.game = item.dataset.game;
            gameFilterBtn.textContent = item.textContent;
            applyFilters();
            gameListContainer.classList.remove("is-open");
        });

        searchBar.addEventListener("input", e => {
            currentFilters.search = e.target.value.toLowerCase().replace("#", "");
            applyFilters();
        });

        gameFilterBtn.addEventListener("click", e => {
            e.stopPropagation();
            gameListContainer.classList.toggle("is-open");
            typeListContainer.classList.remove("is-open");
        });

        typeFilterBtn.addEventListener("click", e => {
            e.stopPropagation();
            typeListContainer.classList.toggle("is-open");
            gameListContainer.classList.remove("is-open");
        });

        typeListContainer.addEventListener("change", () => {
            currentFilters.type = [...typeListContainer.querySelectorAll("input:checked")].map(i => i.value);
            typeFilterBtn.textContent = currentFilters.type.length ? `${currentFilters.type.length} Selected` : "Type ▼";
            applyFilters();
        });

        document.addEventListener("click", e => {
            if (!dropdown.contains(e.target)) gameListContainer.classList.remove("is-open");
            if (!typeListContainer.contains(e.target) && !typeFilterBtn.contains(e.target))
                typeListContainer.classList.remove("is-open");
        });

        pokeContainer.addEventListener("click", e => {
            const card = e.target.closest(".pokedex-card");
            if (!card) return;

            const id = card.dataset.id;
            const pokemon = allPokemons.find(p => p.arrayIndex == id);
            if (!pokemon) return;

            currentPokemonIndex = currentPokemonList.findIndex(p => p.arrayIndex == id);

            openPokemonModal(pokemon);
            updateModalNavigation();

            customModal.classList.add("is-open");
            modalOverlay.classList.add("is-open");
        });

        modalCloseBtn.addEventListener("click", () => {
            customModal.classList.remove("is-open");
            modalOverlay.classList.remove("is-open");
        });

        modalOverlay.addEventListener("click", () => {
            customModal.classList.remove("is-open");
            modalOverlay.classList.remove("is-open");
        });

        modalNavPrev.addEventListener("click", () => navigateModal(-1));
        modalNavNext.addEventListener("click", () => navigateModal(1));
    }

    initializePokedex();
});
