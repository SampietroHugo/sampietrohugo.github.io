fetch('../pokedex.json')
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('.pokeContainer');

    const pokemonsOrdenados = data.pokemons.sort((a, b) => {
      const numA = parseInt(a.number.replace('#', ''), 10);
      const numB = parseInt(b.number.replace('#', ''), 10);
      return numA - numB;
    });

    pokemonsOrdenados.forEach(p => {
      const div = document.createElement('div');
      div.className = `pokemon ${p.type} ${p.shiny ? 'shiny' : ''}`;
      div.innerHTML = `
        <div class="imgContainer">
          <img src="${p.image}" alt="${p.alt}">
        </div>
        <div class="info ${p.shiny ? 'shiny' : ''}">
          <p><strong>${p.name}</strong></p>
          <p><strong>${p.number}</strong></p>
          <p><strong>${p.game}</strong></p>
          <p><strong>${p.date}</strong></p>
        </div>`;
      container.appendChild(div);
    });
});