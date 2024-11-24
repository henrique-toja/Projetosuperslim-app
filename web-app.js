// Variável para armazenar o evento beforeinstallprompt
let installPromptEvent;
let deferredPrompt;

// Evento beforeinstallprompt para detectar a possibilidade de instalação do PWA
window.addEventListener('beforeinstallprompt', (event) => {
  // Impede que o prompt padrão apareça
  event.preventDefault();

  // Salva o evento para ser acionado manualmente mais tarde
  installPromptEvent = event;
  deferredPrompt = event; // Para a segunda parte do código

  // Exibe o botão de instalação (primeira parte)
  const installSection = document.getElementById('install');
  if (installSection) {
    installSection.style.display = 'block';
  }

  // Adiciona o comportamento de clique ao botão de instalação
  const installButton = document.getElementById('installButton');
  if (installButton) {
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
        // Após a escolha do usuário, o botão de instalação é ocultado novamente
        installSection.style.display = 'none';
      });
    });
  }
});

// Para garantir que o botão de instalação só apareça para PWAs, você pode adicionar um fallback.
window.addEventListener('appinstalled', () => {
  console.log('O app foi instalado!');
  const installSection = document.getElementById('install');
  if (installSection) {
    installSection.style.display = 'none';  // Esconde o botão se o app já foi instalado
  }
});

// Bloquear o "pull-to-refresh" apenas no PWA
document.addEventListener('touchmove', function(event) {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // Impedir o pull-to-refresh quando estiver no topo da página, mas apenas no PWA
  if (isStandalone && window.scrollY === 0 && event.touches[0].clientY > 0) {
    event.preventDefault(); // Bloqueia o refresh
  }
}, { passive: false });

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

// Lógica para exibir o prompt de instalação do PWA (segunda parte)
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt disparado');

  // Prevenir o prompt padrão do navegador
  e.preventDefault();
  deferredPrompt = e;

  // Verificar se o app está sendo executado em modo standalone (PWA instalado)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  if (!isStandalone) {
    // Criar e exibir o botão de instalação apenas se o app não for PWA
    const installButton = document.createElement('button');
    installButton.textContent = 'Instalar o App';
    installButton.style.position = 'fixed';
    installButton.style.bottom = '10px';
    installButton.style.right = '10px';
    document.body.appendChild(installButton);

    // Lidar com a ação do usuário no botão de instalação
    installButton.addEventListener('click', () => {
      deferredPrompt.prompt(); // Exibir o prompt para instalação
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou instalar o app.');
        } else {
          console.log('Usuário recusou instalar o app.');
        }
        // Limpar variáveis e remover o botão
        deferredPrompt = null;
        installButton.remove();
      });
    });
  }
});