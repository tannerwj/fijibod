const userName = process.env.FIJIBOD_USER;
if (!userName) {
  console.error('FIJIBOD_USER environment variable is required');
  process.exit(1);
}

const baseUrl = process.env.FIJIBOD_API_URL || 'https://fijibod-api.twj.workers.dev';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${baseUrl}${path}`, opts);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data?.error || data?.message || res.statusText;
    throw new Error(`${method} ${path} failed (${res.status}): ${msg}`);
  }
  return data;
}

export { userName };
export const get = (path) => request('GET', path);
export const post = (path, body) => request('POST', path, body);
export const put = (path, body) => request('PUT', path, body);
export const del = (path) => request('DELETE', path);
