import cache from 'memory-cache';
const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours

function handleCache (response, fileURL) {
  const responseBody = [];
  response.on('data', (chunk) => {
    responseBody.push(chunk);
  });

  response.on('end', () => {
    const fullResponse = Buffer.concat(responseBody).toString();
    cache.put(fileURL, fullResponse, cacheDuration);
  });

  console.log(`Cached ${fileURL} for ${cacheDuration}ms`);
}

export default handleCache;
