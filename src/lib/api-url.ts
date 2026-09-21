/** Resolve the API origin without sending loopback requests to Nginx's default site. */
export function resolveApiUrl(configured?: string, publicUrl?: string): string {
  const url = new URL(configured ?? publicUrl ?? "http://localhost:8000/api/v1");
  const isNginxLoopback = url.protocol === "http:"
    && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)
    && url.port === "";

  // Development servers with an explicit port retain their original origin.
  return (isNginxLoopback && publicUrl
    ? new URL(url.pathname, new URL(publicUrl).origin).toString()
    : url.toString()).replace(/\/$/, "");
}
