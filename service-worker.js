const CACHE_NAME = "min-pt-cache-v22";
const APP_FILES = [
  "./?v=22",
  "./index.html?v=22",
  "./style.css?v=22",
  "./app.js?v=22",
  "./manifest.json?v=22",
  "./service-worker.js?v=22",
  "./images/exercises.svg?v=22",
  "./images/brystpress-machine.png",
  "./images/skulderpress-machine.png",
  "./images/pec-deck-machine.png",
  "./images/triceps-machine.png",
  "./images/nedtrekk-machine.png",
  "./images/roing-machine.png",
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
