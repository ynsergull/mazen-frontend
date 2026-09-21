import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/api-url.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { resolveApiUrl } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("production loopback uses the public virtual host and preserves the API path", () => {
  assert.equal(resolveApiUrl("http://127.0.0.1/api/v1", "https://mazenkirtasiye.com/api/v1"), "https://mazenkirtasiye.com/api/v1");
  assert.equal(resolveApiUrl("http://127.0.0.1:80/api/v1/", "https://mazenkirtasiye.com/api/v1"), "https://mazenkirtasiye.com/api/v1");
});

test("local Laravel development ports remain unchanged", () => {
  assert.equal(resolveApiUrl("http://localhost:8000/api/v1", "https://mazenkirtasiye.com/api/v1"), "http://localhost:8000/api/v1");
  assert.equal(resolveApiUrl(), "http://localhost:8000/api/v1");
});

test("explicit external API configuration takes precedence", () => {
  assert.equal(resolveApiUrl("https://api.example.test/api/v1/", "https://mazenkirtasiye.com/api/v1"), "https://api.example.test/api/v1");
  assert.equal(resolveApiUrl(undefined, "https://mazenkirtasiye.com/api/v1"), "https://mazenkirtasiye.com/api/v1");
});

test("loopback without public configuration is not silently redirected elsewhere", () => {
  assert.equal(resolveApiUrl("http://127.0.0.1/api/v1"), "http://127.0.0.1/api/v1");
});
