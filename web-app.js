// Variável para armazenar o evento beforeinstallprompt
let installPromptEvent;

// Evento beforeinstallprompt para detectar a possibilidade de instalação do PWA
window.addEventListener('beforeinstallprompt', (event) => {
  // Impede que o prompt padrão apareça
  event.preventDefault();

  // Salva o evento para ser acionado manualmente mais tarde
  installPromptEvent = event;

  // Seleciona o botão de instalação com a classe "install"
  const installButton = document.querySelector('.install');

  if (installButton) {
    // Exibe o botão de instalação
    installButton.style.display = 'block';

    // Adiciona o comportamento de clique ao botão de instalação
    installButton.addEventListener('click', () => {
      // Mostra o prompt de instalação quando o botão é clicado
      installPromptEvent.prompt();

      // Aguarda a resposta do usuário (aceitar ou recusar a instalação)
      installPromptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação.');
        } else {
          console.log('Usuário recusou a instalação.');
        }
        // O botão continua visível após a resposta, sem ocultar
      });
    });
  }
});

// Registrar o Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => {
      console.log('Service Worker registrado com sucesso.');
    })
    .catch((error) => {
      console.error('Falha ao registrar o Service Worker:', error);
    });
}

// Bloquear o "pull-to-refresh" apenas no PWA
document.addEventListener('touchmove', function(event) {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // Impedir o pull-to-refresh quando estiver no topo da página, mas apenas no PWA
  if (isStandalone && window.scrollY === 0 && event.touches[0].clientY > 0) {
    event.preventDefault(); // Bloqueia o refresh
  }
}, { passive: false });