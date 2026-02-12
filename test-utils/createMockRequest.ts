/**
 * Creates a mock Request object compatible with Next.js API route handlers.
 */
export function createMockRequest(options: {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  url?: string;
  searchParams?: Record<string, string>;
}): Request {
  const {
    method = "GET",
    body,
    headers = {},
    url = "http://localhost:3000/api/test",
    searchParams,
  } = options;

  let finalUrl = url;
  if (searchParams) {
    const params = new URLSearchParams(searchParams);
    finalUrl = `${url}?${params.toString()}`;
  }

  const requestInit: RequestInit = {
    method,
    headers: new Headers({
      "Content-Type": "application/json",
      ...headers,
    }),
  };

  if (body && method !== "GET" && method !== "HEAD") {
    requestInit.body = JSON.stringify(body);
  }

  return new Request(finalUrl, requestInit);
}

/**
 * Creates mock Headers with convenience for testing IP extraction.
 */
export function createMockHeaders(headers: Record<string, string>): Headers {
  return new Headers(headers);
}
