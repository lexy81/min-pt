const CACHE_NAME = "min-pt-cache-v69";
const APP_FILES = [
  "./?v=69",
  "./index.html?v=69",
  "./style.css?v=69",
  "./app.js?v=69",
  "./manifest.json?v=69",
  "./service-worker.js?v=69",
  "./images/exercises.svg?v=69",
  "./images/brystpress-machine.png",
  "./images/skulderpress-machine.png",
  "./images/pec-deck-machine.png",
  "./images/triceps-machine.png",
  "./images/nedtrekk-machine.png",
  "./images/roing-machine.png",
  "./images/back-extension-machine.png",
  "./images/biceps-curl-machine.png",
  "./images/leg-press-machine.png",
  "./images/leg-curl-machine.png",
  "./images/leg-extension-machine.png",
  "./images/ab-machine.png",
  "./images/rotating-ab-machine.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("min-pt-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("./");
      return undefined;
    })
  );
});
