export class HTTPError extends Error {
    constructor(method, url, statusCode, body) {
        super(`${method} to ${url} received status ${statusCode} with body: ${body}`);
    }
}
