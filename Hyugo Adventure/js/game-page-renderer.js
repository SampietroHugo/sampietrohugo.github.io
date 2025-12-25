document.addEventListener("DOMContentLoaded", async function () {
    const pathname = window.location.pathname;

    let gameName = pathname.substring(pathname.lastIndexOf('/') + 1).replace('.html', '');
    const pathParts = pathname.split('/');
    const jsonFolder = pathParts[pathParts.length - 2];
    const jsonPath = `/json/${jsonFolder}/${gameName}.json`;

    const templateSource = document.getElementById('game-template')?.innerHTML;
    const appContent = document.getElementById('app-content');

    if (!templateSource || !appContent) {
        console.error("Error: Handlebars template or main container not found.");
        return;
    }

    try {
        const response = await fetch(jsonPath);

        if (!response.ok) {
            throw new Error(`Data file for the game (${jsonPath}) was not found. Status: ${response.status}`);
        }

        const gameData = await response.json();

        gameData.spriteClass = 'sprite pokemon-card-sprite';
        if (jsonFolder === 'hack-roms') {
            gameData.spriteClass += ' sprite-hackrom';
        }

        gameData.hasItem = !!gameData.item;
        gameData.hasGender = !!gameData.gender;
        gameData.hasForms = Array.isArray(gameData.forms) && gameData.forms.length > 0;
        gameData.hasTypes = Array.isArray(gameData.types) && gameData.types.length > 0;
        gameData.hasStats = !!gameData.stats;
        gameData.hasAbilities = Array.isArray(gameData.abilities) && gameData.abilities.length > 0;
        gameData.hasDexEntry = !!gameData.dexEntry;
        gameData.hasSpecies = !!gameData.species;
        gameData.hasEvolutions = Array.isArray(gameData.evolutions) && gameData.evolutions.length > 0;

        gameData.items = gameData.items || [];
        gameData.moves = gameData.moves || [];

        const template = Handlebars.compile(templateSource);
        const html = template(gameData);

        appContent.innerHTML = html;
        document.title = gameData.title + ' - PokéJourney';

        setupHoverListeners();

    } catch (error) {
        console.error("Error during data injection:", error);
        appContent.innerHTML = `
            <div class="alert alert-danger text-center mt-5" role="alert">
                <h1>Game Data Load Error 🚨</h1>
                <p>Could not load the game details for <strong>${gameName}</strong>.</p>
                <p>Verify if the file <code>${jsonPath}</code> exists and is valid.</p>
                <small>Error details: ${error.message}</small>
            </div>
        `;
    }
});

function setupHoverListeners() {
    const appContent = document.getElementById('app-content');

    appContent.addEventListener('mouseover', function (event) {
        const trigger = event.target.closest('.form-trigger');

        if (trigger) {
            const card = trigger.closest('.pokemonCard');
            if (!card) return;

            const sprite = card.querySelector('.pokemon-card-sprite');
            const altSpriteUrl = trigger.dataset.altSprite;

            if (sprite && altSpriteUrl && sprite.src !== altSpriteUrl) {
                sprite.style.opacity = 0;
                setTimeout(() => {
                    sprite.src = altSpriteUrl;
                    sprite.style.opacity = 1;
                }, 200);
            }
        }
    });

    appContent.addEventListener('mouseout', function (event) {
        const trigger = event.target.closest('.form-trigger');

        if (trigger) {
            const card = trigger.closest('.pokemonCard');
            if (!card) return;

            const sprite = card.querySelector('.pokemon-card-sprite');
            const defaultSpriteUrl = trigger.dataset.defaultSprite;

            if (sprite && defaultSpriteUrl && sprite.src !== defaultSpriteUrl) {
                sprite.style.opacity = 0;
                setTimeout(() => {
                    sprite.src = defaultSpriteUrl;
                    sprite.style.opacity = 1;
                }, 200);
            }
        }
    });
}
