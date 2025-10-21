function loadComponent(path, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na rede ao buscar ${path}: ${response.statusText}`)
                }

                return response.text();
            })
            .then(data => {
                element.innerHTML = data;
            })

            .catch(error => {
                console.error(`Falha ao carregar o componente de ${path}:`, error)
                element.innerHTML = `<p style='color:red; text-align:center;'>Erro ao carregar esta seção.</p>`;
            })
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadComponent('/pages/partials/header.html', 'header-placeholder');
    loadComponent('/pages/partials/footer.html', 'footer-placeholder')
})

