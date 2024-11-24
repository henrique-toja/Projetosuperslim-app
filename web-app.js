// Registrar o Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker registrado com sucesso.'))
    .catch((error) => console.error('Falha ao registrar o Service Worker:', error));
}

// Lógica para exibir o prompt de instalação
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir o prompt padrão
  e.preventDefault();
  deferredPrompt = e;

  // Exibir o botão ou notificação personalizada para instalar o app
  const installButton = document.createElement('button');
  installButton.textContent = 'Instalar o App';
  installButton.style.position = 'fixed';
  installButton.style.bottom = '10px';
  installButton.style.right = '10px';
  document.body.appendChild(installButton);

  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou instalar o app.');
      } else {
        console.log('Usuário recusou instalar o app.');
      }
      deferredPrompt = null;
      installButton.remove();
    });
  });
});