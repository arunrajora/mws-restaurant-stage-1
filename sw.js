const CACHE_VERSION = 4.0
const CACHE_NAME = `restaurant-v${CACHE_VERSION}`;
// Dimensions of various responsive images available :)
const IMAGE_DIMENSIONS = [270, 640, 800];

// List of URLS to pre cache.
let precached_urls = [
  "/",
  "/css/styles.css",
  "/js/main.js",
  "/js/dbhelper.js",
  "/js/restaurant_info.js",
  "/index.html",
  "/restaurant.html",
  "/data/restaurants.json"
];

// List of images to pre cache
for (let imageId = 1; imageId <= 10; imageId++) {
  IMAGE_DIMENSIONS
    .forEach( dimension => precached_urls.push(`/img/${imageId}-${dimension}w.jpg`))
}

self.addEventListener('install', event => {
  // Precache images
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(precached_urls))
  );
});


self.addEventListener('activate', event => 
  //clear old cache if version does not match
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key); // A cache version we are not interested in deleted :(
      })
    )).then(() => clients.claim()) // claim the client
  )
);


self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // handle only get requests from the same origin
  // or
  // if the request is for google maps api which is on different origin and ends with initmap
  if (event.request.method === 'GET' && (url.origin === location.origin || url.href.endsWith('initMap'))) {
    event.respondWith(
      //open cache
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request, { ignoreSearch: true })
        .then(response => {
        let fetchOptions = {};
        // if request is cross origin, set options accordingly
        if(url.origin === location.origin) fetch.cors = 'no-cors';
          return response || fetch(event.request, fetchOptions)
            .then(response => {
              // Cache the response for future use ;)
              cache.put(event.request, response.clone());
              return response;
            });
        });
      })
    );
  }
});