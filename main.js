document.addEventListener("DOMContentLoaded", function () {
    // Função para carregar o conteúdo HTML e adicionar animação
    function loadHTMLContent(page) {
        const content = document.getElementById('content-placeholder');
        content.classList.add('fade-out');

        setTimeout(() => {
            fetch(page)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao carregar o conteúdo: ' + response.statusText);
                    }
                    return response.text();
                })
                .then(data => {
                    content.innerHTML = data;
                    content.classList.remove('fade-out');
                    content.classList.add('fade-in');

                    // Reaplica eventos a botões e links carregados dinamicamente
                    applyButtonEvents();
                })
                .catch(error => {
                    console.error('Erro ao carregar o conteúdo:', error);
                    content.innerHTML = '<p>Não foi possível carregar o conteúdo. Por favor, tente novamente mais tarde.</p>';
                });
        }, 500);
    }

    // Aplica eventos a botões e links carregados dinamicamente
    function applyButtonEvents() {
        const buttonsAndLinks = document.querySelectorAll(
            '#content-placeholder .btn-know[data-page], ' +
            '#content-placeholder .btn-next[data-page], ' +
            '#content-placeholder .btn-auth[data-page], ' +
            'a[data-page]'
        );

        buttonsAndLinks.forEach(element => {
            element.removeEventListener('click', handleClick);
            element.addEventListener('click', handleClick);
        });
    }

    function handleClick(event) {
        const page = this.getAttribute('data-page') || this.getAttribute('href');
        if (page) {
            event.preventDefault();
            loadHTMLContent(page);
        }
    }

    // Função para verificar se o usuário está logado
    function checkLogin() {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            loadHTMLContent('home.html'); // Carrega home.html se estiver logado
        } else {
            loadHTMLContent('login.html'); // Carrega login.html se não estiver logado
        }
    }

    // Verifica o login ao carregar a página
    checkLogin();
});
