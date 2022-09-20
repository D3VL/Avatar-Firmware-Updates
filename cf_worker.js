// This is running on our cloudflare account, it will proxy the download requests to github while keeping the same origin
// It's needed to keep functionality of the downgrade feature, but as it's caching at CF should also make downloads tonnes faster!

const remote = 'https://raw.githubusercontent.com/D3VL/Avatar-Firmware-Updates/main/_firmwares/';

async function handleRequest(event) {
    const request = event.request;
    const cacheUrl = new URL(request.url);

    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    let response = await cache.match(cacheKey);

    if (!response) {
        console.log(`Response for request url: ${request.url} not present in cache. Fetching and caching request.`);

        const { pathname } = cacheUrl;
        const destinationURL = remote + pathname.replace("/dl/", "")

        response = await fetch(destinationURL);
        response = new Response(response.body, response);
        response.headers.append('Cache-Control', 's-maxage=604800');

        event.waitUntil(cache.put(cacheKey, response.clone()));
    } else {
        console.log(`Cache hit for: ${request.url}.`);
    }
    return response;
}

addEventListener('fetch', event => {
    try {
        return event.respondWith(handleRequest(event));
    } catch (e) {
        return event.respondWith(new Response('Error thrown ' + e.message));
    }
});