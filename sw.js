const CACHE_NAME = "creator-os-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon.svg",
  "./modules/onboarding.js",
  "./modules/dashboard.js",
  "./modules/platforms.js",
  "./modules/monetization.js",
  "./modules/quests.js",
  "./modules/leaderboard.js",
  "./modules/parents.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
