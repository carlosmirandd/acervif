// Service Worker exclusivo para notificações push (Firebase Cloud Messaging).
// Propositalmente NAO faz cache nem intercepta requisicoes (sem "fetch" handler),
// para nao reintroduzir o problema de PWA presa numa versao antiga do site.

importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyA91S9TJQ-YhfKPrvXMBVwaop6cwfmPLIc",
    authDomain: "acervif12.firebaseapp.com",
    projectId: "acervif12",
    storageBucket: "acervif12.firebasestorage.app",
    messagingSenderId: "698647384488",
    appId: "1:698647384488:web:c45b99428d9767fe04cd9d"
});

// Ativa este SW imediatamente, sem esperar reload da página — evita a corrida
// em que getToken() tenta se inscrever antes de existir um Service Worker ativo.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || payload.data?.title || 'AcervIF';
    const body = payload.notification?.body || payload.data?.body || '';
    const url = payload.data?.url || '/';

    self.registration.showNotification(title, {
        body,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        data: { url }
    });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(clients.openWindow(url));
});
